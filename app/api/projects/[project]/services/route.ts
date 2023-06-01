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
                error: "You must be logged in to get a project.",
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

    if (usersInProject.length === 0) {
        return NextResponse.json(
            {
                error: "You must be a member of the project to get it.",
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
                error: "project not found",
            },
            { status: 404 },
        );
    }

    const registry = await prisma.registry.findFirst({
        where: {
            projectId: project.id,
        },
    });
    console.log("registry");
    console.log(registry);

    return NextResponse.json(
        { registry, lambda: null, database: null, containers: null },
        { status: 200 },
    );
}
