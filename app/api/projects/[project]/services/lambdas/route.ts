import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ResponseService from "@/lib/next-response";
import { InternalServerError, StugaError } from "@/lib/services/error/error";
import { VerifyIfUserCanAccessProject } from "@/lib/services/project/verify-user-access";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { throwIfLambdaCreationCandidateIsNotValid } from "@/lib/models/lambdas/validation/lambda-create-candidate";
import prisma from "@/lib/prisma";
import {
    LambdaCPULimit,
    LambdaCreateCandidate,
    LambdaMemoryLimit,
    LambdaVisibility,
} from "../../../../../../lib/models/lambdas/lambda-create";
import { getProjectNamespaces } from "@/lib/services/registry/namespace/get-project-namespaces";
import { StugaErrorToNextResponse } from "@/lib/services/error/stuga-error-to-next-response";
import { getLambdaImageInProject } from "@/lib/services/lambdas/get-lambda-image-in-user-namespaces";
import { checkIfDockerHubImageExists } from "@/lib/services/utils/check-if-docker-hub-image-exists";
import { GetLambdaByNameInProject } from "@/lib/services/lambdas/get-image-by-name";
import { Registry } from "../../../../../../lib/models/lambdas/lambda-create";
import { encrypt } from "@/lib/services/utils/crypt";
import { verifyIfImageExists } from "@/lib/services/lambdas/verify-if-image-exists";
import { CreateGateway } from "@/lib/services/lambdas/liserk-api/create-gateway";
import { Lambda } from "@prisma/client";
import { InitLambdaImage } from "@/lib/services/lambdas/liserk-api/init-lambda-image";
import { DeleteGatewayLambda } from "../../../../../../lib/services/lambdas/liserk-api/delete-gateway-lambda";
import { InitApiKey } from "../../../../../../lib/services/lambdas/liserk-api/init-lambda-api-key-gateway";

export interface LambdaCreateResponse {
    name: string;
    imageName: string;
    cpuLimit: LambdaCPULimit;
    memoryLimit: LambdaMemoryLimit;
    confidentiality: LambdaVisibility;
    minInstanceNumber: number;
    maxInstanceNumber: number;
    timeout: number;
}

export async function POST(request: Request, { params }: NextRequest) {
    const req: LambdaCreateCandidate = await request.json();
    const session = await getServerSession(authOptions);
    const projectId = params!.project;
    const userId = session!.user!.id as string;

    console.log(req);

    const projectGetOrNextResponse = await VerifyIfUserCanAccessProject(
        projectId,
        session,
    );

    if (projectGetOrNextResponse instanceof StugaError) {
        return StugaErrorToNextResponse(projectGetOrNextResponse);
    }

    try {
        throwIfLambdaCreationCandidateIsNotValid(req);
    } catch (e) {
        if (e instanceof Error) {
            return ResponseService.badRequest(e.message, e);
        }
        return InternalServerError(e);
    }

    try {
        const lambda = await GetLambdaByNameInProject({
            name: req.name,
            projectId: projectId,
        });
        if (lambda) {
            return ResponseService.conflict("lambda-name-already-exists");
        }
    } catch (e) {
        if (e instanceof StugaError) {
            return StugaErrorToNextResponse(e);
        }
        return ResponseService.internalServerError("internal-server-error", e);
    }

    const repository = req.imageName.split("/")[0];
    const imageName = req.imageName.split("/")[1];

    const verifyIfImageExistsResponse = await verifyIfImageExists(
        imageName,
        projectId,
        req.registry,
        repository,
    );
    if (verifyIfImageExistsResponse instanceof NextResponse) {
        return verifyIfImageExistsResponse;
    }

    const envVarCrypted = req.environmentVariables.map((envVar) => {
        return {
            key: encrypt(envVar.key),
            value: encrypt(envVar.value),
        };
    });

    var now = new Date();
    var now_utc = new Date(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds(),
    );
    let stateCreated = "init";
    let lambdaCreated: Lambda;
    
    const visiblityPath = req.confidentiality.visibility === "private" ? "api-key" : "public";
    const urlAccess = `${process.env.GATEWAY_URL_ACCESS}/${projectGetOrNextResponse.name}/${visiblityPath}/${req.name}`;

    try {
        lambdaCreated = await prisma.lambda.create({
            data: {
                name: req.name,
                imageName: req.imageName,
                registry: req.registry,
                cpuLimitmCPU: req.cpuLimit.value,
                memoryLimitMB: req.memoryLimit.value,
                visibility: req.confidentiality.visibility,
                privateConfig: req.confidentiality.access,
                minInstances: req.minInstanceNumber,
                maxInstances: req.maxInstanceNumber,
                envVars: envVarCrypted,
                timeoutSeconds: req.timeout,
                urlAccess: urlAccess,
                createdAt: now_utc,
                createdBy: userId,
                projectId,
            },
        });

        stateCreated = "lambda-created";

        await CreateGateway({
            projectName: projectGetOrNextResponse.name,
            lambdaName: req.name,
            lambdaId: lambdaCreated.id,
            visibility: req.confidentiality.visibility as "public" | "private",
        });

        if (
            req.confidentiality.visibility === "private" &&
            req.confidentiality.access?.mode === "apiKey"
        ) {
            const apiKeyResponse = await InitApiKey({
                projectName: projectGetOrNextResponse.name,
            });
            const newAccess = {
                ...req.confidentiality.access,
                apiKey: apiKeyResponse.apiKey,
            };

            await prisma.lambda.update({
                where: {
                    id: lambdaCreated.id,
                },
                data: {
                    privateConfig: newAccess,
                },
            });
        }

        stateCreated = "gateway-created";

        await InitLambdaImage({
            id: lambdaCreated.id,
            image_name: req.imageName,
            ram_mega: req.memoryLimit.value,
            max_time: req.timeout,
            cpu: req.cpuLimit.value,
            storage_mega: 2,
            minimum_instance_number: req.minInstanceNumber,
            maximum_instance_number: req.maxInstanceNumber,
        });

        stateCreated = "all-lambda-created";
    } catch (e) {
        console.log("error at " + stateCreated);
        if (stateCreated === "lambda-created") {
            await rollbackLambdaCreated(lambdaCreated!.id);
        } else if (stateCreated === "gateway-created") {
            await rollbackLambdaCreated(lambdaCreated!.id);
            await DeleteGatewayLambda({
                projectName: projectGetOrNextResponse.name,
                lambdaName: req.name,
            });
        }

        if (e instanceof StugaError) {
            return StugaErrorToNextResponse(e);
        } else if (e instanceof NextResponse) {
            return e;
        }
    }

    return ResponseService.created({
        name: req.name,
        imageName: req.imageName,
        cpuLimit: req.cpuLimit,
        memoryLimit: req.memoryLimit,
        confidentiality: req.confidentiality,
        minInstanceNumber: req.minInstanceNumber,
        maxInstanceNumber: req.maxInstanceNumber,
        timeout: req.timeout,
    } as LambdaCreateResponse);
}

export async function GET(request: Request, { params }: NextRequest) {
    const session = await getServerSession(authOptions);
    const projectId = params!.project;

    const projectGetOrNextResponse = await VerifyIfUserCanAccessProject(
        projectId,
        session,
    );

    if (projectGetOrNextResponse instanceof StugaError) {
        return projectGetOrNextResponse;
    }

    try {
        const lambdas = await prisma.lambda.findMany({
            where: {
                projectId: projectId,
            },
        });
        console.log(lambdas[0].createdAt);
        return ResponseService.success(lambdas);
    } catch (e) {
        return ResponseService.internalServerError("internal-server-error", e);
    }
}

export const rollbackLambdaCreated = async (lambdaId: string) => {
    try {
        await prisma.lambda.delete({
            where: {
                id: lambdaId,
            },
        });
    } catch (e) {
        console.error(e);
    }
};
