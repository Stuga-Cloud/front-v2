import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { StugaError } from "@/lib/services/error/error";
import { VerifyIfUserCanAccessProject } from "@/lib/services/project/verify-user-access";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { StugaErrorToNextResponse } from "@/lib/services/error/stuga-error-to-next-response";
import ResponseService from "@/lib/next-response";
import { decrypt, encrypt } from "@/lib/services/utils/crypt";
import { LambdaModel } from "@/lib/models/lambdas/lambda";
import { GetLambdaByNameInProject } from "@/lib/services/lambdas/get-image-by-name";
import { checkSettingsUpdate, checkVisibility } from "./check-update";

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

    await prisma.lambda.delete({
        where: {
            id: lambdaId,
        },
    });

    return ResponseService.success({
        message: "lambda-deleted",
    });
}

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

export async function PUT(request: Request, { params }: NextRequest) {
    const session = await getServerSession(authOptions);
    const req: LambdaModel = await request.json();
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

    const envVarCrypted = req.environmentVariables.map((envVar) => {
        return {
            key: encrypt(envVar.key),
            value: encrypt(envVar.value),
        };
    });

    await checkSettingsUpdate(req, lambda);
    await checkVisibility(req, lambda);

    const envVarDecrypted = lambda.envVars.map((envVar) => {
        const environmentFormat = envVar as { key: string; value: string };
        return {
            key: decrypt(environmentFormat.key),
            value: decrypt(environmentFormat.value),
        };
    });

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
        },
    });

    return ResponseService.success({
        ...lambda,
        envVars: envVarDecrypted,
    });
}
