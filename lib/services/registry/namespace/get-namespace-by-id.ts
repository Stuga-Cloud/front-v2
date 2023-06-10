import prisma from "@/lib/prisma";
import { InternalServerError, StugaError } from "../error/error";
import { RegistryNamespace } from "@prisma/client";

export const GetNamespaceById = async (namespaceId: string):  Promise<RegistryNamespace> => {
    try {
        const namespace = await prisma.registryNamespace.findUnique({
            where: {
                id: namespaceId,
            },
        });
        if (!namespace) {
            throw new StugaError({
                message: "namespace not found",
                error: "namespace-not-found",
                status: 404,
            });
        }
        return namespace;
    } catch (e) {
        throw InternalServerError;
    }
};
