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
