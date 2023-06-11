import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { LambdaCreateCandidate } from "@/components/services/lambdas/create/types/lambda-create";
import ResponseService from "@/lib/next-response";
import { StugaError } from "@/lib/services/error/error";
import { VerifyIfUserCanAccessProject } from "@/lib/services/project/verify-user-access";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function POST(request: Request, { params }: NextRequest) {
    const req: LambdaCreateCandidate = await request.json();
    const session = await getServerSession(authOptions);
    const projectId = params!.project;

    const projectGetOrNextResponse = await VerifyIfUserCanAccessProject(
        projectId,
        session,
    );

    if (projectGetOrNextResponse instanceof StugaError) {
        return projectGetOrNextResponse;
    }

    setTimeout(() => {
        console.log("project created");
    }, 2000);

    return ResponseService.created({
        message: "lambda-created",
        lambda: {
            name: req.name,
            imageName: req.imageName,
            cpuLimit: req.cpuLimit,
            memoryLimit: req.memoryLimit,
            confidentiality: req.confidentiality,
            minInstanceNumber: req.minInstanceNumber,
            maxInstanceNumber: req.maxInstanceNumber,
            timeout: req.timeout,
        },
    });
}
