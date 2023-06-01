import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Remove a member from a project
 * @param request
 * @param params
 * @constructor
 */
// @ts-ignore
export async function DELETE(request: Request, { params }: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json(
            {
                error: `You must be logged in to delete a project membership. (userId: ${
                    params!.user
                }, projectId: ${params!.project})`,
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

    const userId = params!.user;
    const projectId = params!.project;

    const project = await prisma.project.findUnique({
        where: {
            id: projectId,
        },
    });

    if (!project) {
        return NextResponse.json(
            {
                error: `Project does not exist. (projectId: ${projectId})`,
            },
            { status: 404 },
        );
    }
    if (project.createdBy !== loggedUser.id) {
        return NextResponse.json(
            {
                error: `You are not the owner of this project. (projectId: ${projectId})`,
            },
            { status: 401 },
        );
    }

    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });

    if (!user) {
        return NextResponse.json(
            {
                error: `User does not exist. (userId: ${userId})`,
            },
            { status: 404 },
        );
    }

    const projectMembership = await prisma.projectMembership.findUnique({
        where: {
            userId_projectId: {
                userId,
                projectId,
            },
        },
    });

    if (!projectMembership) {
        return NextResponse.json(
            {
                error: `User is not a member of this project or project does not exist. (projectId: ${projectId}, userId: ${userId})`,
            },
            { status: 404 },
        );
    }

    const deletedProjectMembership = await prisma.projectMembership.delete({
        where: {
            userId_projectId: {
                userId,
                projectId,
            },
        },
    });

    return NextResponse.json(deletedProjectMembership, { status: 200 });
}
