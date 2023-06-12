import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { isConnected } from "@/lib/utils";
import ResponseService from "@/lib/next-response";
import { FindContainerNamespaceByName } from "@/lib/services/containers/get-container-namespace";
import { UpsertContainerNamespace } from "@/lib/services/containers/create-container-namespace";
import { CreateContainerNamespaceBody } from "@/lib/services/containers/create-container-namespace.body";

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

        const namespace = await UpsertContainerNamespace(
            name,
            description,
            userId,
        );
        if (!namespace) {
            console.log("Error creating namespace :", namespace);
            return ResponseService.internalServerError();
        }

        const containerNamespace = await prisma.containerNamespace.create({
            data: {
                name: namespace.name,
                description: namespace.description,
                projectId: project.id,
            },
        });
        if (!containerNamespace) {
            return ResponseService.internalServerError(
                "Error creating container namespace",
            );
        }

        return ResponseService.success(namespace);
    } catch (error) {
        console.error("Error updating namespace:", error);
        return ResponseService.internalServerError();
    }
}
