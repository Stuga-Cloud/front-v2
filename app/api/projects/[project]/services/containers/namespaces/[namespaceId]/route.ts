import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { isConnected } from "@/lib/utils";
import ResponseService from "@/lib/next-response";
import { GetContainerNamespaceByName } from "@/lib/services/containers/namespaces/get-container-namespace";
import { DeleteContainerNamespace } from "@/lib/services/containers/namespaces/delete-container-namespace";
import { UpdateContainerNamespace } from "@/lib/services/containers/namespaces/update-container-namespace";
import { GetContainerNamespaceByID } from "@/lib/services/containers/namespaces/get-container-namespace-by-id";

export async function GET(
    _req: NextRequest,
    { params }: { params: { project: string; namespaceId: string } },
) {
    const session = await getServerSession(authOptions);

    if (!isConnected(session)) {
        return ResponseService.unauthorized();
    }
    try {
        const projectId = params.project;
        const project = await prisma.project.findFirst({
            where: { id: projectId },
            include: {
                members: true,
            },
        });
        if (!project) {
            return ResponseService.notFound(
                `Container not found with id ${projectId}`,
            );
        }

        const userId = (session!.user! as any).id;
        if (project.members.every((member) => member.userId !== userId)) {
            return ResponseService.unauthorized(
                `User ${userId} is not a member of project ${projectId}`,
            );
        }

        const namespaceId = params.namespaceId;
        const namespace = await prisma.containerNamespace.findFirst({
            where: { id: namespaceId },
        });
        if (!namespace) {
            return ResponseService.notFound(
                `Namespace not found with id ${namespaceId}`,
            );
        }

        const namespaceInAPI = await GetContainerNamespaceByID(
            namespace.idInAPI,
            userId,
        );
        if (!namespaceInAPI) {
            return ResponseService.notFound(
                `Namespace not found with name ${project.name}`,
            );
        }

        return ResponseService.success({
            namespace,
            namespaceInAPI,
        });
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

// Update namespace description
export async function PUT(
    req: NextRequest,
    { params }: { params: { project: string; namespaceId: string } },
) {
    const session = await getServerSession(authOptions);

    if (!isConnected(session)) {
        return ResponseService.unauthorized();
    }
    try {
        const userId = (session!.user! as any).id;
        const projectId = params.project;
        const namespaceId = params.namespaceId;

        const project = await prisma.project.findFirst({
            where: { id: projectId },
            include: {
                containerNamespaces: true,
                members: true,
            },
        });
        if (!project) {
            return ResponseService.notFound(
                `Project not found with id ${projectId}`,
            );
        }
        if (
            !project.members.some(
                (member) => member.userId === userId && member.role === "ADMIN",
            )
        ) {
            return ResponseService.unauthorized(
                `You are not a member of this project`,
            );
        }
        if (
            !project.containerNamespaces.some(
                (namespace) => namespace.id === namespaceId,
            )
        ) {
            return ResponseService.notFound(
                `Namespace not found with id ${namespaceId} in project ${projectId}`,
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

        const namespaceInAPI = await GetContainerNamespaceByID(
            namespace.idInAPI,
            userId,
        );
        if (!namespaceInAPI) {
            return ResponseService.notFound(
                `Namespace not found with id ${namespace.idInAPI}`,
            );
        }

        const data: { description: string } = await req.json();
        const description = data.description;
        if (!description) {
            return ResponseService.badRequest(
                "Description is required in body when updating namespace",
            );
        }

        const updatedNamespace = await UpdateContainerNamespace(
            namespaceInAPI.id,
            description,
            namespaceInAPI.userId,
            userId,
        );
        if (!updatedNamespace) {
            return ResponseService.internalServerError(
                `Error updating namespace with id ${namespaceId}`,
            );
        }

        return ResponseService.success(updatedNamespace);
    } catch (error) {
        console.error("Error updating namespace:", error);
        return ResponseService.internalServerError();
    }
}
