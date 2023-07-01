import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { isConnected } from "@/lib/utils";
import ResponseService from "@/lib/next-response";
import { GetContainerApplicationByID } from "@/lib/services/containers/namespaces/find-container-application-by-id";
import { DeleteContainerApplicationByID } from "@/lib/services/containers/namespaces/delete-container-application-by-id";
import { verifyIfImageExists } from "@/lib/services/lambdas/verify-if-image-exists";
import { UpdateContainerApplicationBody } from "@/lib/services/containers/update-container-application.body";
import { UpdateContainerApplication } from "@/lib/services/containers/update-container-application";

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

        const containerInNamespace = namespace.containers.find(
            (container) => container.id === applicationId,
        );
        if (!containerInNamespace) {
            return ResponseService.notFound(
                `Container ${applicationId} not found in namespace ${namespaceId} while getting application ${applicationId} in project ${projectId}`,
            );
        }

        const container = await prisma.container.findUnique({
            where: {
                id: containerInNamespace.id,
            },
            include: {
                namespace: {
                    include: {
                        containers: true,
                    },
                },
            },
        });

        if (!container) {
            return ResponseService.notFound(
                `Container ${applicationId} not found in database while deleting application ${applicationId} in project ${projectId}`,
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

        let container = namespace.containers.find(
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

export async function PUT(
    req: NextRequest,
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

    const user = await prisma.user.findUnique({
        where: { email: session!.user!.email! },
    });

    if (!user) {
        return ResponseService.unauthorized();
    }

    const projectId = params!.project;
    const project = await prisma.project.findUnique({
        where: { id: projectId },
    });

    if (!project) {
        return ResponseService.notFound();
    }

    const {
        name,
        description,
        image,
        registry,
        port,
        containerSpecifications,
        scalabilitySpecifications,
        applicationType,
        environmentVariables,
        secrets,
        administratorEmail,
    }: UpdateContainerApplicationBody = await req.json();

    try {
        if (image) {
            const repository = image.split("/")[0];
            const parts = image.split("/");
            const imageName = parts.slice(1).join("/");

            const verifyIfImageExistsResponse = await verifyIfImageExists(
                imageName,
                projectId,
                registry,
                repository,
            );
            if (verifyIfImageExistsResponse instanceof NextResponse) {
                return ResponseService.notFound("Image not found in registry", {
                    error: "image_not_found_in_registry",
                    fullError: verifyIfImageExistsResponse,
                    applicationImage: image,
                    applicationName: name,
                });
            }
        }

        const namespaceId = params.namespaceId;
        const namespace = await prisma.containerNamespace.findUnique({
            where: { id: namespaceId },
            include: {
                containers: true,
            },
        });
        if (!namespace) {
            return ResponseService.notFound(
                `Namespace ${namespaceId} not found`,
            );
        }

        const applicationId = params.applicationId;

        const containerInNamespace = namespace.containers.find(
            (container) => container.id === applicationId,
        );
        if (!containerInNamespace) {
            return ResponseService.notFound(
                `Container ${applicationId} not found in namespace ${namespaceId} while updating application ${applicationId} in project ${projectId}`,
            );
        }

        const container = await prisma.container.findUnique({
            where: { id: applicationId },
        });
        if (!container) {
            return ResponseService.notFound(
                `Container ${applicationId} not found while updating application ${applicationId} in project ${projectId}`,
            );
        }

        const userId = (session!.user! as any).id;
        const application = await UpdateContainerApplication(
            container.idInAPI,
            userId,
            {
                name: name,
                namespaceId: namespace.idInAPI,
                description: description,
                image: image,
                registry: registry,
                port: port,
                zone: "europe-west-1",
                containerSpecifications,
                scalabilitySpecifications,
                applicationType,
                environmentVariables,
                secrets,
                userId: user.id,
                administratorEmail: administratorEmail,
            },
        );
        if (!application) {
            console.log("Error updating application :", application);
            return ResponseService.internalServerError();
        }

        const updatedContainer = await prisma.container.update({
            where: {
                id: params.applicationId,
            },
            data: {
                name,
            },
        });

        return ResponseService.updated(updatedContainer);
    } catch (error) {
        console.error("Error updating container:", error);
        return ResponseService.internalServerError();
    }
}
