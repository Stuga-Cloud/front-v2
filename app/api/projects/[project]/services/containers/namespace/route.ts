import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { isConnected } from "@/lib/utils";
import ResponseService from "@/lib/next-response";
import { FindContainerNamespaceByName } from "@/lib/services/containers/get-container-namespace";

export async function GET(
    _req: NextRequest,
    { params }: { params: { project: string } },
) {
    const session = await getServerSession(authOptions);

    if (!isConnected(session)) {
        return ResponseService.unauthorized();
    }
    try {
        const projectId = params.project;
        const container = await prisma.project.findFirst({
            where: { id: projectId },
        });
        if (!container) {
            return ResponseService.notFound(
                `Container not found with id ${projectId}`,
            );
        }

        const namespace = await FindContainerNamespaceByName(
            container.name,
            (session!.user! as any).id,
        );
        if (!namespace) {
            return ResponseService.notFound(
                `Namespace not found with name ${container.name}`,
            );
        }

        return ResponseService.success(namespace);
    } catch (error) {
        console.error("Error fetching namespace:", error);
        return ResponseService.internalServerError();
    }
}
