import { ContainerNamespace } from "@/lib/models/containers/container-namespace";
import axios from "axios";
import { UpsertContainerNamespaceError } from "@/lib/services/containers/errors/upsert-container-namespace.error";
import { GetContainerNamespaceByName } from "@/lib/services/containers/get-container-namespace";

export const UpsertContainerNamespace = async (
    name: string,
    description: string,
    userId: string,
): Promise<ContainerNamespace | null> => {
    try {
        const namespace = axios.post<{ namespace: ContainerNamespace | null }>(
            `${process.env.CONTAINER_API}/namespaces`,
            {
                name: name,
                description: description,
                userId: userId,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.CONTAINER_AUTH_TOKEN}`,
                },
            },
        );
        if ((await namespace).status === 409) {
            return await GetContainerNamespaceByName(name);
        }
        return (await namespace).data.namespace;
    } catch (e) {
        console.log("Error creating namespace:", e);
        throw new UpsertContainerNamespaceError(
            `Error creating namespace '${name}' : ${e}`,
        );
    }
};
