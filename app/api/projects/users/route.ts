import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ProjectMembershipRole } from "@/lib/models/project";

interface RequestBody {
    email: string;
    projectId: string;
    role: ProjectMembershipRole;
}

/**
 * Create a new project membership - add a new member to a project
 * @param request
 * @param params
 * @constructor
 */
// @ts-ignore
export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    const req = await request.json();
    const { email, projectId, role }: RequestBody = req;
    if (!session) {
        return NextResponse.json(
            {
                error: `You must be logged in to add a member to a project.`,
            },
            { status: 401 },
        );
    }

    const loggedUser = await prisma.user.findUnique({
        where: {
            email: session.user!.email!,
        },
    });

    if (!loggedUser) {
        return NextResponse.json(
            {
                error: `Logged user does not exist.`,
            },
            { status: 404 },
        );
    }

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
                error: `Project with id ${projectId} does not exist.`,
            },
            { status: 404 },
        );
    }

    var isAdmin = false;
    for (const member of project.members) {
        if (member.userId === loggedUser.id && member.role === "ADMIN") {
            isAdmin = true;
            break;
        }
    }
    if (!isAdmin) {
        return NextResponse.json(
            {
                error: `You are not the owner of the project.`,
            },
            { status: 403 },
        );
    }

    const member = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (!member) {
        return NextResponse.json(
            {
                error: `User with email ${email} does not exist.`,
            },
            { status: 404 },
        );
    }

    const projectMembership = await prisma.projectMembership.findUnique({
        where: {
            userId_projectId: {
                userId: member.id,
                projectId,
            },
        },
    });

    if (projectMembership) {
        return NextResponse.json(
            {
                error: `User with email ${email} is already a member of the project.`,
            },
            { status: 409 },
        );
    }

    try {
        const projectMembership = await prisma.projectMembership.create({
            data: {
                userId: member.id,
                projectId,
                hasAccepted: false,
                role,
            },
        });
        return NextResponse.json(projectMembership, { status: 201 });
    } catch (e: any) {
        return NextResponse.json(
            {
                error: `An error occurred while adding the member to the project: ${e.message}`,
            },
            { status: 500 },
        );
    }
}
