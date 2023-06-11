import prisma from "@/lib/prisma";
import { InternalServerError, StugaError } from "../../error/error";
import { RegistryNamespace } from "@prisma/client";

export const getProjectNamespaces = async ({
    projectId,
}: {
    projectId: string;
}): Promise<RegistryNamespace[]> => {
    try {

        const projectFromDb = await prisma.project.findUnique({
            where: {
                id: projectId,
            },
        });
    
        if (!projectFromDb) {
            throw new StugaError({
                message: "project not found",
                status: 404,
                error: "project-not-found",
            });
        }
    
        const registry = await prisma.registry.findFirst({
            where: {
                projectId: projectFromDb!.id,
            },
        });
    
        if (!registry) {
            throw new StugaError({
                message: "registry not found",
                status: 404,
                error: "registry-not-found",
            });
        }
    
        const registryNamespaces = await prisma.registryNamespace.findMany({
            where: {
                registryId: registry.id,
            },
        });
        return registryNamespaces;
    } catch (error) {
        throw InternalServerError(error);
    }
};
