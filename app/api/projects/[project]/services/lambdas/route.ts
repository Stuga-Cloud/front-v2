import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ResponseService from "@/lib/next-response";
import { InternalServerError, StugaError } from "@/lib/services/error/error";
import { VerifyIfUserCanAccessProject } from "@/lib/services/project/verify-user-access";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
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

    const projectGetOrNextResponse = await VerifyIfUserCanAccessProject(
        projectId,
        session,
    );

    if (projectGetOrNextResponse instanceof StugaError) {
        return projectGetOrNextResponse;
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

    if (req.confidentiality.visibility === "private") {
        try {
            const image = await getLambdaImageInProject({
                imageName: req.imageName,
                projectId: projectId,
                dependencies: {
                    getProjectNamespaces: getProjectNamespaces,
                },
            });
        } catch (e) {
            if (e instanceof StugaError) {
                return StugaErrorToNextResponse(e);
            }
            return ResponseService.internalServerError(
                "internal-server-error",
                e,
            );
        }
    } else {
        try {
            const imageNameSplit = req.imageName.split(":");
            const imageExist = await checkIfDockerHubImageExists(
                imageNameSplit[0],
                imageNameSplit[1],
            );
            if (!imageExist) {
                return ResponseService.badRequest("image does not exist");
            }
        } catch (e) {
            return ResponseService.internalServerError(
                "internal-server-error",
                e,
            );
        }
    }

    var now = new Date();
    var now_utc = new Date(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds(),
    );

    await prisma.lambda.create({
        data: {
            name: req.name,
            imageName: req.imageName,
            cpuLimitmCPU: req.cpuLimit.value,
            memoryLimitMB: req.memoryLimit.value,
            visibility: req.confidentiality.visibility,
            privateConfig: req.confidentiality.access,
            minInstances: req.minInstanceNumber,
            maxInstances: req.maxInstanceNumber,
            timeoutSeconds: req.timeout,
            createdAt: now_utc,
            createdBy: userId,
            projectId,
        },
    });

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
