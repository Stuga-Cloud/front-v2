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

        const namespaces = await Promise.all(
            project.containerNamespaces.map(async (ns) => {
                const namespace = await GetContainerNamespaceByID(
                    ns.idInAPI,
                    (session!.user! as any).id,
                );
                if (!namespace) {
                    return null;
                }
                return namespace;
            }),
        );
        if (!namespaces) {
            return ResponseService.notFound(
                `No namespaces found for project ${projectId}`,
            );
        }

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
