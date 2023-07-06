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

    console.log("get project " + projectId);
    console.log("session " + session?.user?.email);
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

    console.log(projectMemberships)

    if (
        !projectMemberships.some(
            // @ts-ignore
            (membership) => membership.userId === session.user!.id,
        )
    ) {
        return NextResponse.json(
            {
                error: "Vous n'êtes pas autorisé à récupérer ce projet.",
            },
            { status: 403 },
        );
    }

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
        include: {
            containerNamespaces: true,
            members: true,
        },
    });

    if (!project) {
        return NextResponse.json(
            {
                error: "Projet introuvable",
            },
            { status: 404 },
        );
    }

    const members: Member[] = usersInProject.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
        role: projectMemberships.find(
            (membership) => membership.userId === user.id,
        )!.role,
    }));

    const projectResponse: Project = {
        id: project!.id,
        name: project!.name,
        members: members,
        // @ts-ignore
        containerNamespaces: project!.containerNamespaces,
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


// Delete project, but if there is a container namespace, a database, a lamdba or a registry -> dont delete
// @ts-ignore
export async function DELETE(request: Request, { params }: NextRequest) {
    const session = await getServerSession(authOptions);
    const projectId = params!.project;

    if (!session) {
        return NextResponse.json(
            {
                error: `You must be signed in to delete a project.`,
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
        include: {
            containerNamespaces: true,
            databases: true,
            lambdas: true,
            registry: true,
            members: true,
        },
    });

    if (!project) {
        return NextResponse.json(
            {
                error: "Project not found.",
            },
            { status: 404 },
        );
    }

    var isAdmin = false;
    for(var member of project.members) {
        if(member.userId == user.id && member.role == "ADMIN") {
            isAdmin = true;
            break;
        }
    }
    
    if (!isAdmin) {
        return NextResponse.json(
            {
                message: "You are not authorized to delete this project (not admin)",
                code: "NOT_ADMIN",
            },
            { status: 403 },
        );
    }

    var stillLeftServices: string[] = [];
    if(project.containerNamespaces.length > 0) {
        const leftService = "Container namespace(s)";
        const containerNamespaces = project.containerNamespaces.map((containerNamespace) => containerNamespace.name);
        stillLeftServices.push(`${leftService} : ${containerNamespaces.join(", ")}`);
    }
    if(project.databases.length > 0) {
        const leftService = "Database(s)";
        const databases = project.databases.map((database) => database.name);
        stillLeftServices.push(`${leftService} : ${databases.join(", ")}`);
    }
    if(project.lambdas.length > 0) {
        const leftService = "Lambda(s)";
        const lambdas = project.lambdas.map((lambda) => lambda.name);
        stillLeftServices.push(`${leftService} : ${lambdas.join(", ")}`);
    }
    if(project.registry) {
        const leftService = "Container registry";
        stillLeftServices.push(`${leftService}`);
    }

    if(stillLeftServices.length > 0) {
        return NextResponse.json(
            {
                message: `Project not empty. Still left services : ${stillLeftServices.join(", ")}`,
                code: "PROJECT_NOT_EMPTY",
            },
            { status: 403 },
        );
    }
    
    try {
        const deletedProject = await prisma.project.delete({
            where: {
                id: projectId,
            },
        });

        const deletedProjectMemberships = await prisma.projectMembership.deleteMany({
            where: {
                projectId: projectId,
            },
        });

        return NextResponse.json(
            {
                message: `Le projet ${deletedProject.name} a été supprimé.`,
                project: deletedProject,
                projectMemberships: deletedProjectMemberships,
            },
            { status: 200 },
        );
    } catch (e: any) {
        return NextResponse.json(
            {
                error: `An error occurred while deleting the project: ${e.message}`,
            },
            { status: 500 },
        );
    }
}