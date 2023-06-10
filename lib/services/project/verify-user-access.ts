import { Project } from "@prisma/client";
import { StugaError } from "../error/error";
import prisma from "@/lib/prisma";

export const VerifyIfUserCanAccessProject = async (
    projectId: string,
    session: any,
): Promise<Project | StugaError> => {
    try {
        if (!session) {
            return new StugaError({
                message: "You must be logged in to get a project.",
                error: "access-denied",
                status: 401,
            });
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
            return new StugaError({
                message: "You must be a member of the project to get it.",
                error: "access-denied-to-project",
                status: 401,
            });
        }

        const projectFound = await prisma.project.findFirst({
            where: {
                id: projectId,
            },
        });

        if (!projectFound) {
            return new StugaError({
                message: "project not found",
                error: "project-not-found",
                status: 404,
            });
        }

        return projectFound;
    } catch (error) {
        return new StugaError({
            message: "Something went wrong while verifying access to project",
            error: "project-access-verification-failed",
            status: 500,
        });
    }
};
