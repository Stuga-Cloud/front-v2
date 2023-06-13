import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { isConnected } from "@/lib/utils";
import ResponseService from "@/lib/next-response";
import { GetContainerNamespaceByName } from "@/lib/services/containers/namespaces/get-container-namespace";
import { DeleteContainerNamespace } from "@/lib/services/containers/namespaces/delete-container-namespace";

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

        const namespace = await GetContainerNamespaceByName(
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

export async function DELETE(
    _req: NextRequest,
    { params }: { params: { project: string; namespaceId: string } },
) {
    const session = await getServerSession(authOptions);

    if (!isConnected(session)) {
        return ResponseService.unauthorized();
    }
    try {
        const projectId = params.project;
        const namespaceId = params.namespaceId;

        const project = await prisma.project.findFirst({
            where: { id: projectId },
        });
        if (!project) {
            return ResponseService.notFound(
                `Project not found with id ${projectId}`,
            );
        }

        const namespace = await prisma.containerNamespace.findFirst({
            where: { id: namespaceId },
        });
        if (!namespace) {
            return ResponseService.notFound(
                `Namespace not found with id ${namespaceId}`,
            );
        }

        const namespaceInAPI = await GetContainerNamespaceByName(
            namespace.name,
            (session!.user! as any).id,
        );
        if (!namespaceInAPI) {
            return ResponseService.notFound(
                `Namespace not found with name ${namespace.name}`,
            );
        }

        // Also delete namespace from API
        const deletedNamespace = await DeleteContainerNamespace(
            namespaceInAPI.id,
            (session!.user as any).id,
        );
        if (!deletedNamespace) {
            return ResponseService.internalServerError(
                `Error deleting namespace with id ${namespaceId} from API`,
            );
        }

        const containerNamespace = await prisma.containerNamespace.delete({
            where: { id: namespaceId },
        });
        if (!containerNamespace) {
            return ResponseService.internalServerError(
                `Error deleting namespace with id ${namespaceId}`,
            );
        }

        return ResponseService.success(namespace);
    } catch (error) {
        console.error("Error deleting namespace:", error);
        return ResponseService.internalServerError();
    }
}
