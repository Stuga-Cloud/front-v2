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
import { DeleteLambda } from "@/lib/services/lambdas/liserk-api/delete-lambda";
import { InitLambdaImage } from "@/lib/services/lambdas/liserk-api/init-lambda-image";

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

    let stepUpdate = "init";
    try {
        stepUpdate = "Redeploy";
        console.log(stepUpdate);
        await DeleteLambda({
            lambdaId: lambda.id,
        });
        stepUpdate = "after delete lambda";
        console.log(stepUpdate);
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
        stepUpdate = "after init";
        console.log(stepUpdate);
    } catch (e) {
        console.log("error at " + stepUpdate);
        if (e instanceof StugaError) {
            return StugaErrorToNextResponse(e);
        } else if (e instanceof NextResponse) {
            return e;
        }

        return ResponseService.internalServerError("internal-server-error", e);
    }

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
