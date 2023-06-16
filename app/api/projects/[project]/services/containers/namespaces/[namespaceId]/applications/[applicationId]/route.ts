import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { isConnected } from "@/lib/utils";
import ResponseService from "@/lib/next-response";
import { GetContainerApplicationByID } from "@/lib/services/containers/namespaces/find-container-application-by-id";
import { DeleteContainerApplicationByID } from "@/lib/services/containers/namespaces/delete-container-application-by-id";

export async function GET(
    _req: NextRequest,
    {
        params,
    }: {
        params: { project: string; namespaceId: string; applicationId: string };
    },
) {
    const session = await getServerSession(authOptions);

    if (!isConnected(session)) {
        return ResponseService.unauthorized();
    }
    try {
        const projectId = params!.project;
        const namespaceId = params.namespaceId;
        const applicationId = params.applicationId;
        const userId = (session!.user! as any).id;

        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: {
                members: true,
                containerNamespaces: {
                    include: {
                        containers: {
                            include: {
                                namespace: true,
                            },
                        },
                    },
                },
            },
        });
        if (!project) {
            return ResponseService.notFound(
                `Project ${projectId} not found while getting application ${applicationId}`,
            );
        }

        if (!project.members.find((member) => member.userId === userId)) {
            return ResponseService.unauthorized(
                `User ${userId} is not a member of project ${projectId}`,
            );
        }

        const namespace = project.containerNamespaces.find(
            (namespace) => namespace.id === namespaceId,
        );
        if (!namespace) {
            return ResponseService.notFound(
                `Container namespace ${namespaceId} not found while getting application ${applicationId} in project ${projectId}`,
            );
        }

        const container = namespace.containers.find(
            (container) => container.id === applicationId,
        );
        if (!container) {
            return ResponseService.notFound(
                `Container ${applicationId} not found in namespace ${namespaceId} while getting application ${applicationId} in project ${projectId}`,
            );
        }

        const containerIdInAPI = container.idInAPI;
        const containerInAPI = await GetContainerApplicationByID(
            containerIdInAPI,
            userId,
        );
        if (!containerInAPI) {
            return ResponseService.notFound(
                `Container ${applicationId} not found in API while getting application ${applicationId} in project ${projectId}`,
            );
        }

        return ResponseService.success({
            container: container,
            containerInAPI: containerInAPI,
        });
    } catch (error) {
        console.error("Error fetching container:", error);
        return ResponseService.internalServerError();
    }
}

export async function DELETE(
    _req: NextRequest,
    {
        params,
    }: {
        params: { project: string; namespaceId: string; applicationId: string };
    },
) {
    const session = await getServerSession(authOptions);

    if (!isConnected(session)) {
        return ResponseService.unauthorized();
    }
    try {
        const projectId = params!.project;
        const namespaceId = params.namespaceId;
        const applicationId = params.applicationId;
        const userId = (session!.user! as any).id;

        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: {
                members: true,
                containerNamespaces: {
                    include: {
                        containers: true,
                    },
                },
            },
        });
        if (!project) {
            return ResponseService.notFound(
                `Project ${projectId} not found while deleting application ${applicationId}`,
            );
        }

        if (!project.members.find((member) => member.userId === userId)) {
            return ResponseService.unauthorized(
                `User ${userId} is not a member of project ${projectId}`,
            );
        }

        const namespace = project.containerNamespaces.find(
            (namespace) => namespace.id === namespaceId,
        );
        if (!namespace) {
            return ResponseService.notFound(
                `Container namespace ${namespaceId} not found while deleting application ${applicationId} in project ${projectId}`,
            );
        }

        const container = namespace.containers.find(
            (container) => container.id === applicationId,
        );
        if (!container) {
            return ResponseService.notFound(
                `Container ${applicationId} not found in namespace ${namespaceId} while deleting application ${applicationId} in project ${projectId}`,
            );
        }

        const containerIdInAPI = container.idInAPI;
        const deletedContainer = await DeleteContainerApplicationByID(
            containerIdInAPI,
            userId,
        );
        if (!deletedContainer) {
            return ResponseService.notFound(
                `Container ${containerIdInAPI} not found in API while deleting application ${applicationId} in project ${projectId}`,
            );
        }

        await prisma.container.delete({
            where: {
                id: container.id,
            },
        });

        return ResponseService.success({
            container: container,
            containerInAPI: deletedContainer,
        });
    } catch (error) {
        console.error("Error deleting container:", error);
        return ResponseService.internalServerError();
    }
}
