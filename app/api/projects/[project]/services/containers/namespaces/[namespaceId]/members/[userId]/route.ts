import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { GetContainerNamespaceByID } from "@/lib/services/containers/namespaces/get-container-namespace-by-id";
import { RemoveMemberFromContainerNamespace } from "@/lib/services/containers/namespaces/remove-member-from-container-namespace-by-id";
import { isConnected } from "@/lib/utils";

type DeleteNamespaceMembersParam = {
    params: { project: string; namespaceId: string; userId: string };
};

export async function DELETE(
    request: Request,
    { params }: DeleteNamespaceMembersParam,
) {
    const session = await getServerSession(authOptions);
    if (!isConnected(session)) {
        return NextResponse.json(
            {
                error: "You must be logged in to get a project.",
            },
            { status: 401 },
        );
    }

    const projectId = params.project;
    const project = await prisma.project.findUnique({
        where: {
            id: projectId,
        },
        include: {
            members: true,
        },
    });
    if (!project) {
        return NextResponse.json(
            {
                error: `Project ${projectId} not found`,
            },
            { status: 404 },
        );
    }

    const removedBy = (session!.user as any).id;
    if (
        !project.members.some((membership) => membership.userId === removedBy)
    ) {
        return NextResponse.json(
            {
                error: "You must be a member of the project to get it.",
            },
            { status: 401 },
        );
    }

    const namespaceId = params.namespaceId;
    const namespace = await prisma.containerNamespace.findUnique({
        where: { id: namespaceId },
    });
    if (!namespace) {
        return NextResponse.json(
            {
                error: `Namespace ${namespaceId} not found`,
            },
            { status: 404 },
        );
    }

    const namespaceInAPI = await GetContainerNamespaceByID(
        namespace.idInAPI,
        removedBy,
    );
    if (!namespaceInAPI) {
        return NextResponse.json(
            {
                error: `Namespace in API ${namespaceId} not found`,
            },
            { status: 404 },
        );
    }

    await RemoveMemberFromContainerNamespace(
        namespaceInAPI.id,
        params.userId,
        removedBy,
    );

    return NextResponse.json(
        {
            message: `Removed user ${params.userId} from namespace ${namespaceId}`,
        },
        { status: 200 },
    );
}
