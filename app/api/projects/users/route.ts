import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Create a new project membership - add a new member to a project
 * @param request
 * @param params
 * @constructor
 */
// @ts-ignore
export async function POST(request: Request, { params }: NextRequest) {
    const session = await getServerSession(authOptions);
    const userId = params!.user;
    if (!session) {
        return NextResponse.json(
            {
                error: "Vous devez être connecté pour ajouter un membre à un projet.",
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
                error: "Vous devez être connecté pour ajouter un membre à un projet.",
            },
            { status: 401 },
        );
    }

    const { projectId, email } = await request.json();

    const project = await prisma.project.findUnique({
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

    const member = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (!member) {
        return NextResponse.json(
            {
                error: "L'utilisateur n'existe pas.",
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
                error: "L'utilisateur est déjà membre du projet.",
            },
            { status: 409 },
        );
    }

    try {
        const projectMembership = await prisma.projectMembership.create({
            data: {
                userId: member.id,
                projectId,
            },
        });
        return NextResponse.json(projectMembership, { status: 201 });
    } catch (e: any) {
        return NextResponse.json(
            {
                error: `Une erreur est survenue lors de l'ajout du membre au projet : ${e.message}`,
            },
            { status: 500 },
        );
    }
}
