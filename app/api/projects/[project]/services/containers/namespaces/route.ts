import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { isConnected } from "@/lib/utils";
import ResponseService from "@/lib/next-response";
import { CreateContainerNamespace } from "@/lib/services/containers/namespaces/create-container-namespace";
import { CreateContainerNamespaceBody } from "@/lib/services/containers/namespaces/create-container-namespace.body";
import { ContainerNamespaceAlreadyExistError } from "@/lib/services/containers/errors/container-namespace-already-exist";
import { GetContainerNamespaceByID } from "@/lib/services/containers/namespaces/get-container-namespace-by-id";
import { FindContainerNamespaceError } from "@/lib/services/containers/errors/find-container-namespace.error";
import { ContainerApplicationNamespace } from "@/lib/models/containers/container-application-namespace";
import { log } from "console";
import { AxiosError } from "axios";
import { UnauthorizedToAccessNamespaceError } from "@/lib/services/containers/errors/unauthorize-to-access-namespace.error";

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
        const project = await prisma.project.findFirst({
            where: { id: projectId },
            include: {
                containerNamespaces: true,
            },
        });
        if (!project) {
            return ResponseService.notFound(
                `Container not found with id ${projectId}`,
            );
        }

        let namespaces = await Promise.all(
            project.containerNamespaces.map(async (ns) => {
                try {
                    const namespace = await GetContainerNamespaceByID(
                        ns.idInAPI,
                        (session!.user! as any).id,
                    );
                    if (!namespace.namespace) {
                        return null;
                    }
                    namespace.namespace.isUserAuthorized = true;
                    return namespace.namespace;
                } catch (e) {
                    console.log('error while getting namespaces', e);
                    if (e instanceof AxiosError) {
                        console.log('Status while getting namespaces', e.response?.status);
                        
                        if (e.response?.status === 404) {
                            return null;
                        }
                        if (e.response?.status === 403) {
                            return {
                                id: ns.idInAPI,
                                name: ns.name,
                                description: "",
                                userId: "",
                                createdAt: new Date(),
                                updatedAt: new Date(),
                                applications: [],
                                memberships: [],
                                isUserAuthorized: false,
                            } as ContainerApplicationNamespace;
                        }
                    }
                    if (e instanceof UnauthorizedToAccessNamespaceError) {
                        console.log('Status while getting namespaces', e.status);
                        if (e.status === 403) {
                            return {
                                id: ns.idInAPI,
                                name: ns.name,
                                description: "",
                                userId: "",
                                createdAt: new Date(),
                                updatedAt: new Date(),
                                applications: [],
                                memberships: [],
                                isUserAuthorized: false,
                            } as ContainerApplicationNamespace;
                        }
                    }
                    
                    throw new FindContainerNamespaceError(
                        `Error getting namespace with id '${ns.idInAPI}' : ${e}`,
                    );
                }
            }),
        );
        namespaces = namespaces.filter((ns) => ns !== null);        
        return ResponseService.success(namespaces);
    } catch (error) {
        console.error("Error fetching namespace:", error);
        return ResponseService.internalServerError();
    }
}

export async function POST(
    req: NextRequest,
    { params }: { params: { project: string } },
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
                members: {
                    select: {
                        userId: true,
                    },
                },
            },
        });
        if (!project) {
            return ResponseService.notFound(
                `Project not found with id ${projectId}`,
            );
        }
        if (
            !project.members.some(
                (m) => m.userId === (session!.user! as any).id,
            )
        ) {
            return ResponseService.unauthorized(
                "You are not a member of this project",
            );
        }

        const { data: body }: { data: CreateContainerNamespaceBody } =
            await req.json();
        const name = body.name;
        const description = body.description;
        const userId = (session!.user! as any).id;

        const namespace = await CreateContainerNamespace(
            name,
            userId,
            description,
        );
        if (!namespace) {
            console.log("Error creating namespace :", namespace);
            return ResponseService.internalServerError();
        }

        const containerNamespace = await prisma.containerNamespace.create({
            data: {
                name: namespace.name,
                projectId: project.id,
                idInAPI: namespace.id,
            },
        });
        if (!containerNamespace) {
            return ResponseService.internalServerError(
                "Error creating container namespace",
            );
        }

        return ResponseService.success(namespace);
    } catch (error: any) {
        if (error instanceof ContainerNamespaceAlreadyExistError) {
            return ResponseService.conflict(error.message);
        }
        console.error("Error creating namespace:", error);
        return ResponseService.internalServerError();
    }
}
