import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { Registry } from "@prisma/client";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface RequestParams {
    project: string;
}

interface RequestBody {
    name: string;
    visibility: "public" | "private";
}

export async function POST(request: Request, { params }: NextRequest) {
    const req: RequestBody = await request.json();
    const session = await getServerSession(authOptions);
    const { project }: RequestParams = params!;
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
                error: "You must be logged in to create a project.",
            },
            { status: 401 },
        );
    }


    const projectFromDb = await prisma.project.findUnique({
        where: {
            id: project,
        },
    });


    if (!projectFromDb) {
        return NextResponse.json(
            {
                error: "project not found",
            },
            { status: 404 },
        );
    }

    try {
        const result = await fetch(
            process.env.BASE_REGISTRY_ENDPOINT + "/api/v2.0/projects",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Basic ${process.env.REGISTRY_AUTH_TOKEN}`,
                },
                body: JSON.stringify({
                    project_name: req.name,
                    public: req.visibility === "public",
                }),
            },
        );


        const registryInProject = await prisma.registry.findFirst({
            where: {
                projectId: projectFromDb!.id,
            },
        });

        if (registryInProject) {
            const registryNamespace = await prisma.registryNamespace.create({
                data: {
                    registryId: registryInProject.id,
                    state: req.visibility,
                    name: req.name,
                },
            });
            return NextResponse.json(registryNamespace, { status: 201 });
        }

        const results = await prisma.$transaction(async (tx) => {
            const registry = await tx.registry.create({
                data: {
                    projectId: projectFromDb!.id,
                },
            });
            const registryNamespace = await tx.registryNamespace.create({
                data: {
                    registryId: registry.id,
                    state: req.visibility,
                    name: req.name,
                },
            });

            return [registry, registryNamespace];
        });

        return NextResponse.json(results[1], { status: 201 });
    } catch (e) {
        console.error(e);
        return NextResponse.json(
            {
                error: `An error occurred while creating the registry namespace: ${e.message}`,
            },
            { status: 500 },
        );
    }
}

