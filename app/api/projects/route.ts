
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

interface RequestBody {
    name: string;
}

export async function POST(request: Request) {
    const req = await request.json();
    const session = await getServerSession(authOptions)
    const { name }: RequestBody = req;
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

    if (!user) {
        return NextResponse.json(
            {
                error: "Vous devez être connecté pour créer un projet.",
            },
            { status: 401 },
        );
    }

    try {
        const project = await prisma.project.create({
            data: {
                name,
                createdBy: user.id,
            },
        });
        return NextResponse.json(project, { status: 201 });
    } catch (e) {
        return NextResponse.json(
            {
                error: `Une erreur est survenue lors de la création du projet : ${e.message}`,
            },
            { status: 500 },
        );
    }
}

