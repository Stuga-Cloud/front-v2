import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Member } from "@/lib/models/member";
import { Project } from "@/lib/models/project";

// @ts-ignore
export async function GET(request: Request, { params }: NextRequest) {
    const session = await getServerSession(authOptions);
    const projectId = params!.project;
    if (!session) {
        return NextResponse.json(
            {
                error: "Vous devez être connecté pour récupérer un projet.",
            },
            { status: 401 },
        );
    }

    const projectMemberships = await prisma.projectMembership.findMany({
        where: {
            projectId,
        },
    });

    const usersInProject = await prisma.user.findMany({
        where: {
            OR: projectMemberships.map((membership) => ({
                id: membership.userId,
            })),
        },
    });

    const project = await prisma.project.findFirst({
        where: {
            id: projectId,
        },
    });

    const members: Member[] = usersInProject.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
    }));

    const projectResponse: Project = {
        id: project!.id,
        name: project!.name,
        members: members,
        createdBy: project!.createdBy,
    };
    return NextResponse.json(projectResponse, { status: 200 });
}

interface UpdateProjectRequestBody {
    name: string;
}

// @ts-ignore
export async function PUT(request: Request, { params }: NextRequest) {
    const req = await request.json();
    const session = await getServerSession(authOptions);
    const { name }: UpdateProjectRequestBody = req;
    const projectId = params!.project;
    if (!session) {
        return NextResponse.json(
            {
                error: `You must be signed in to update a project.`,
            },
            { status: 401 },
        );
    }

    const user = await prisma.user.findUnique({
        where: {
            email: session.user!.email!,
        },
    });

    if (!user) {
        return NextResponse.json(
            {
                error: `Logged in user with email ${
                    session.user!.email
                } not found.`,
            },
            { status: 401 },
        );
    }

    const project = await prisma.project.findFirst({
        where: {
            id: projectId,
        },
    });

    if (!project) {
        return NextResponse.json(
            {
                error: "Le projet n'existe pas.",
            },
            { status: 404 },
        );
    }

    if (project.createdBy !== user.id) {
        return NextResponse.json(
            {
                error: "Vous n'êtes pas autorisé à modifier ce projet.",
            },
            { status: 403 },
        );
    }

    try {
        const updatedProject = await prisma.project.update({
            where: {
                id: projectId,
            },
            data: {
                name,
            },
        });
        return NextResponse.json(updatedProject, { status: 200 });
    } catch (e: any) {
        return NextResponse.json(
            {
                error: `An error occurred while updating the project: ${e.message}`,
            },
            { status: 500 },
        );
    }
}
