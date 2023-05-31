import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request, { params }: NextRequest) {
    const session = await getServerSession(authOptions);
    const projectId = params!.project;
    if (!session) {
        return NextResponse.json(
            {
                error: "Vous devez être connecté pour créer un projet.",
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

    return NextResponse.json(
        { project, members: usersInProject },
        { status: 200 },
    );
}
