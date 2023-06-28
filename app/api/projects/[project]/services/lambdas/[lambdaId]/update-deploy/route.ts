import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { StugaError } from "@/lib/services/error/error";
import { StugaErrorToNextResponse } from "@/lib/services/error/stuga-error-to-next-response";
import { VerifyIfUserCanAccessProject } from "@/lib/services/project/verify-user-access";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import ResponseService from "@/lib/next-response";
import { checkImageUpdate } from "../check-update";
import { LambdaModel } from "@/lib/models/lambdas/lambda";

// @ts-ignore
export async function POST(request: Request, { params }: NextRequest) {
    const req: LambdaModel = await request.json();
    const session = await getServerSession(authOptions);
    const projectId = params!.project;
    const lambdaId = params!.lambdaId;
    // @ts-ignore
    const userId = session!.user!.id as string;

    console.log("update deploy lambda " + req.id + " " + req.imageName);
    console.log(req);

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

    const nextReponse = await checkImageUpdate(projectId, req, lambda);
    if (nextReponse instanceof NextResponse) {
        return nextReponse;
    }

    console.log("emit event to deploy lambda " + req.id + " " + req.imageName);

    await prisma.lambda.update({
        where: {
            id: lambdaId,
        },
        data: {
            imageName: req.imageName,
            registry: req.registry,
        },
    });

    console.log("emit redeploy lambda");

    return ResponseService.success({
        message: "lambda-redeployed",
    });
}
