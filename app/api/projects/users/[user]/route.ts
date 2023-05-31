import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Get all projects for a user
 * @param request
 * @param params
 * @constructor
 */
// @ts-ignore
export async function GET(request: Request, { params }: NextRequest) {
    const session = await getServerSession(authOptions);
    const userId = params!.user;
    if (!session) {
        return NextResponse.json(
            {
                error: "Vous devez être connecté pour créer un projet.",
            },
            { status: 401 },
        );
    }

    const user = await prisma.user.findUnique({
        where: {
            email: session.user!.email!,
        },
    });

    if (!user || user.id !== userId) {
        return NextResponse.json(
            {
                error: "Vous devez être connecté pour créer un projet.",
            },
            { status: 401 },
        );
    }

    const projectMemberships = await prisma.projectMembership.findMany({
        where: {
            userId,
        },
    });

    const projects = await prisma.project.findMany({
        where: {
            OR: projectMemberships.map((membership) => ({
                id: membership.projectId,
            })),
        },
    });

    return NextResponse.json(projects, { status: 200 });
}
