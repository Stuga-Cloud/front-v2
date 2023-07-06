import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { StugaError } from "@/lib/services/error/error";
import { StugaErrorToNextResponse } from "@/lib/services/error/stuga-error-to-next-response";
import { VerifyIfUserCanAccessProject } from "@/lib/services/project/verify-user-access";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import ResponseService from "@/lib/next-response";
import { GetLambdaMetricsLiserk } from "@/lib/services/lambdas/liserk-api/get-lambda-metrics-liserk";

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
    try {

        const lambdaMetrics = await GetLambdaMetricsLiserk({
            lambdaId: lambda.id,
        });
        return ResponseService.success(lambdaMetrics);
    } catch (e) {
        console.log(e);

        return ResponseService.internalServerError;
    }

}