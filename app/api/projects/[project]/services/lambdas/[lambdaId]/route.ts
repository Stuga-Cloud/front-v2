import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { StugaError } from "@/lib/services/error/error";
import { VerifyIfUserCanAccessProject } from "@/lib/services/project/verify-user-access";
import { getServerSession } from "next-auth/next";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { StugaErrorToNextResponse } from "@/lib/services/error/stuga-error-to-next-response";
import ResponseService from "@/lib/next-response";
import { decrypt } from "@/lib/services/utils/crypt";

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