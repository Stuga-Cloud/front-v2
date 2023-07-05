import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { InternalServerError, StugaError } from "@/lib/services/error/error";
import { VerifyIfUserCanAccessProject } from "@/lib/services/project/verify-user-access";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { StugaErrorToNextResponse } from "@/lib/services/error/stuga-error-to-next-response";
import ResponseService from "@/lib/next-response";
import { decrypt, encrypt } from "@/lib/services/utils/crypt";
import { LambdaModel } from "@/lib/models/lambdas/lambda";
import { GetLambdaByNameInProject } from "@/lib/services/lambdas/get-image-by-name";
import {
    checkSettingsUpdate,
    checkVisibility,
    hasGatewayToUpdate,
    hasToDeletForRecreate,
    hasToGenerateApiKey,
    hasMetadataToUpdate,
} from "./check-update";
import { InitLambdaImage } from "@/lib/services/lambdas/liserk-api/init-lambda-image";
import { InitApiKey } from "@/lib/services/lambdas/liserk-api/init-lambda-api-key-gateway";
import { CreateGateway } from "@/lib/services/lambdas/liserk-api/create-gateway";
import { DeleteGatewayLambda } from "@/lib/services/lambdas/liserk-api/delete-gateway-lambda";
import { UpdateImageMetadata } from "@/lib/services/lambdas/liserk-api/update-image-metadata";
import { DeleteLambda } from "@/lib/services/lambdas/liserk-api/delete-lambda";
import { GetAPiKey } from "@/lib/services/lambdas/liserk-api/get-api-key";

// @ts-ignore
export async function DELETE(request: Request, { params }: NextRequest) {
    const session = await getServerSession(authOptions);
    const projectId = params!.project;
    const lambdaId = params!.lambdaId;

    const projectGetOrNextResponse = await VerifyIfUserCanAccessProject(
        projectId,
        session,
    );

    if (projectGetOrNextResponse instanceof StugaError) {
        return StugaErrorToNextResponse(projectGetOrNextResponse);
    }

    const lambda = await prisma.lambda.findFirst({
        where: {
            id: lambdaId,
            projectId: projectId,
        },
    });

    if (!lambda) {
        return ResponseService.notFound("lambda-not-found");
    }

    try {
        await DeleteLambda({
            lambdaId: lambda.id,
        });
    } catch (e) {
        console.log("problem with delete lambda");
    }

    try {
        await DeleteGatewayLambda({
            lambdaName: lambda.name,
            projectName: projectGetOrNextResponse.name,
        });
    } catch (e) {
        console.log("problem with delete gateway lambda");
    }

    await prisma.lambda.delete({
        where: {
            id: lambdaId,
        },
    });

    return ResponseService.success({
        message: "lambda-deleted",
    });
}

// @ts-ignore
export async function GET(request: Request, { params }: NextRequest) {
    const session = await getServerSession(authOptions);
    const projectId = params!.project;
    const lambdaId = params!.lambdaId;

    const projectGetOrNextResponse = await VerifyIfUserCanAccessProject(
        projectId,
        session,
    );

    if (projectGetOrNextResponse instanceof StugaError) {
        return StugaErrorToNextResponse(projectGetOrNextResponse);
    }

    const lambda = await prisma.lambda.findFirst({
        where: {
            id: lambdaId,
            projectId: projectId,
        },
    });

    if (!lambda) {
        return ResponseService.notFound("lambda-not-found");
    }

    const envVarDecrypted = lambda.envVars.map((envVar) => {
        const environmentFormat = envVar as { key: string; value: string };
        return {
            key: decrypt(environmentFormat.key),
            value: decrypt(environmentFormat.value),
        };
    });

    return ResponseService.success({
        ...lambda,
        envVars: envVarDecrypted,
    });
}

// @ts-ignore
export async function PUT(request: Request, { params }: NextRequest) {
    const session = await getServerSession(authOptions);
    const req: LambdaModel = await request.json();
    const projectId = params!.project;
    const lambdaId = params!.lambdaId;
    let stepUpdate = "init";
    console.log(stepUpdate);

    const projectGetOrNextResponse = await VerifyIfUserCanAccessProject(
        projectId,
        session,
    );

    if (projectGetOrNextResponse instanceof StugaError) {
        return StugaErrorToNextResponse(projectGetOrNextResponse);
    }

    const lambda = await prisma.lambda.findFirst({
        where: {
            id: lambdaId,
            projectId: projectId,
        },
    });

    if (!lambda) {
        return ResponseService.notFound("lambda-not-found");
    }

    if (lambda.name !== req.name) {
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
            return ResponseService.internalServerError(
                "internal-server-error",
                e,
            );
        }
    }
    stepUpdate = "envVars";
    console.log(stepUpdate);
    const envVarCrypted = req.environmentVariables.map((envVar) => {
        return {
            key: encrypt(envVar.key),
            value: encrypt(envVar.value),
        };
    });

    // await checkSettingsUpdate(req, lambda);
    // await checkVisibility(req, lambda);

    const envVarDecrypted = lambda.envVars.map((envVar) => {
        const environmentFormat = envVar as { key: string; value: string };
        return {
            key: decrypt(environmentFormat.key),
            value: decrypt(environmentFormat.value),
        };
    });

    stepUpdate = "hasDeleteForRecreate";
    console.log(stepUpdate);
    try {
        if (hasToDeletForRecreate(req, lambda)) {
            stepUpdate = "enter in delete for recreate";
            console.log(stepUpdate);
            await DeleteLambda({
                lambdaId: lambda.id,
            });
            console.log("lambda deleted");
            stepUpdate = "Init lambda image";
            console.log(stepUpdate);
            console.log("lambda image init");
            await InitLambdaImage({
                id: lambda.id,
                image_name: req.imageName,
                ram_mega: req.memoryLimit.value,
                max_time: req.timeout,
                cpu: req.cpuLimit.value,
                storage_mega: 2,
                minimum_instance_number: req.minInstanceNumber,
                maximum_instance_number: req.maxInstanceNumber,
                environment_variables: req.environmentVariables,
            });
        } else {
            stepUpdate = "hasGatewayToUpdate";
            console.log(stepUpdate);
            if (hasGatewayToUpdate(req, lambda)) {
                stepUpdate = "enter in update gateway";
                console.log(stepUpdate);
                console.log("delete gateway");
                await DeleteGatewayLambda({
                    projectName: projectGetOrNextResponse.name,
                    lambdaName: lambda.name,
                });
                console.log("gateway modified");
                console.log(projectGetOrNextResponse.name)
                console.log(req.name)
                console.log(lambda.id)
                console.log(req.confidentiality.visibility)
                console.log("create gateway");
                await CreateGateway({
                    projectName: projectGetOrNextResponse.name,
                    lambdaName: req.name,
                    lambdaId: lambda.id,
                    visibility: req.confidentiality.visibility as
                        | "public"
                        | "private",
                });
                console.log("gateway updated");
            }

            stepUpdate = "hasMetadataToUpdate";
            console.log(stepUpdate);
            if (hasMetadataToUpdate(req, lambda)) {
                stepUpdate = "enter in update metadata";
                console.log(stepUpdate);
                await UpdateImageMetadata({
                    id: lambda.id,
                    image_name: req.imageName,
                    ram_mega: req.memoryLimit.value,
                    max_time: req.timeout,
                    cpu: req.cpuLimit.value,
                    storage_mega: 2,
                    minimum_instance_number: req.minInstanceNumber,
                    maximum_instance_number: req.maxInstanceNumber,
                    environment_variables: req.environmentVariables,
                });
            }
        }

        stepUpdate = "hasToGenerateApiKey";
        console.log(stepUpdate);
        if (
            await hasToGenerateApiKey(
                req.confidentiality.visibility,
                projectGetOrNextResponse,
            )
        ) {
            const apikey = await InitApiKey({
                projectName: projectGetOrNextResponse.name,
            });
            // @ts-ignore
            req.confidentiality.access!.apiKey = apikey.apiKey;
        } else if (req.confidentiality.visibility === "private") {
            const apiKey = await GetAPiKey({
                projectName: projectGetOrNextResponse.name,
            });
            req.confidentiality.access! = {
                mode: "apiKey",
                apiKey: apiKey.apiKey,
            };
        }
    } catch (e) {
        stepUpdate = "ERRORUPDATE ADD";
        console.log(stepUpdate);
        if (e instanceof StugaError) {
            return StugaErrorToNextResponse(e);
        }
        return ResponseService.internalServerError("internal-server-error", e);
    }

    const visiblityPath =
        req.confidentiality.visibility === "private" ? "api-key" : "public";
    const urlAccess = `${process.env.GATEWAY_URL_ACCESS}/${projectGetOrNextResponse.name}/${visiblityPath}/${req.name}`;

    stepUpdate = "BEFORE UPDATE DB";
    console.log(stepUpdate);
    await prisma.lambda.update({
        where: {
            id: lambdaId,
        },
        data: {
            name: req.name,
            envVars: envVarCrypted,
            timeoutSeconds: req.timeout,
            visibility: req.confidentiality.visibility,
            privateConfig:
                req.confidentiality.visibility === "public"
                    ? {}
                    : req.confidentiality.access,
            minInstances: req.minInstanceNumber,
            maxInstances: req.maxInstanceNumber,
            cpuLimitmCPU: req.cpuLimit.value,
            memoryLimitMB: req.memoryLimit.value,
            urlAccess: urlAccess,
        },
    });

    return ResponseService.success({
        ...lambda,
        envVars: envVarDecrypted,
    });
}
