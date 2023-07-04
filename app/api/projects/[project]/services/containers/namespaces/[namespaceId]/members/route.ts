import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { GetContainerNamespaceByID } from "@/lib/services/containers/namespaces/get-container-namespace-by-id";
import { AddMemberInContainerNamespace } from "@/lib/services/containers/namespaces/add-member-in-container-namespace";

type GetNamespaceMembersParam = {
    params: { project: string; namespaceId: string };
};

export async function GET(
    request: Request,
    { params }: GetNamespaceMembersParam,
) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json(
            {
                error: "You must be logged in to get a project.",
            },
            { status: 401 },
        );
    }

    const projectId = params.project;
    const projectMemberships = await prisma.projectMembership.findMany({
        where: {
            projectId,
        },
    });

    const userId = (session!.user as any).id;
    if (
        !projectMemberships.some((membership) => membership.userId === userId)
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
        userId,
    );
    if (!namespaceInAPI.namespace) {
        return NextResponse.json(
            {
                error: `Namespace in API ${namespaceId} not found`,
            },
            { status: 404 },
        );
    }

    const namespaceInAPIMemberships = namespaceInAPI.namespace.memberships;
    const correspondingUsers = await prisma.user.findMany({
        where: {
            id: {
                in: namespaceInAPIMemberships.map(
                    (membership) => membership.userId,
                ),
            },
        },
    });

    const namespaceInAPIMembers = namespaceInAPIMemberships.map(
        (membership) => {
            const correspondingUser = correspondingUsers.find(
                (user) => user.id === membership.userId,
            );
            return {
                ...membership,
                user: correspondingUser,
            };
        },
    );

    return NextResponse.json({ users: namespaceInAPIMembers }, { status: 200 });
}

export type PostNamespaceMembersParam = {
    params: { project: string; namespaceId: string };
};

export async function POST(
    request: Request,
    { params }: PostNamespaceMembersParam,
) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json(
            {
                error: "You must be logged in to get a project.",
            },
            { status: 401 },
        );
    }

    const projectId = params.project;
    const projectMemberships = await prisma.projectMembership.findMany({
        where: {
            projectId,
        },
    });

    const addedBy = (session!.user as any).id;
    if (
        !projectMemberships.some((membership) => membership.userId === addedBy)
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
        addedBy,
    );
    if (!namespaceInAPI.namespace) {
        return NextResponse.json(
            {
                error: `Namespace in API ${namespaceId} not found`,
            },
            { status: 404 },
        );
    }

    const body = await request.json();
    const email = body.email;
    const role = body.role;
    if (!email) {
        return NextResponse.json(
            {
                error: `User ID not found in body`,
            },
            { status: 400 },
        );
    }

    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });
    if (!user) {
        return NextResponse.json(
            {
                error: `User ${email} not found`,
            },
            { status: 404 },
        );
    }

    const userId = user.id;

    // Verify that this user is a member of the project also
    if (
        !projectMemberships.some((membership) => membership.userId === userId)
    ) {
        return NextResponse.json(
            {
                error: `User ${userId} is not a member of the project`,
            },
            { status: 400 },
        );
    }

    const newMembership = await AddMemberInContainerNamespace(
        namespace.idInAPI,
        userId,
        addedBy,
        role,
    );

    return NextResponse.json({ membership: newMembership }, { status: 200 });
}
