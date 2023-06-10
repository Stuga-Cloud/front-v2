import { Project, RegistryNamespace } from "@prisma/client";
import prisma from "@/lib/prisma";

export const VerifyIfNamespaceIsInProject = async ({
    namespace,
    project,
}: {
    namespace: RegistryNamespace;
    project: Project;
}): Promise<boolean> => {
    try {
        const result = await prisma.registryNamespace.findFirst({
            where: {
                id: namespace.id,
                registry: {
                    projectId: project.id,
                },
            },
        });
        return result !== undefined;
    } catch (e) {
        return false;
    }
};
