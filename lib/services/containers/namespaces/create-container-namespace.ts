import { ContainerNamespace } from "@/lib/models/containers/container-namespace";
import axios from "axios";
import { UpsertContainerNamespaceError } from "@/lib/services/containers/errors/upsert-container-namespace.error";
import { GetContainersAPIInfo } from "@/lib/services/containers/get-containers-api-info";
import { ContainerNamespaceAlreadyExistError } from "@/lib/services/containers/errors/container-namespace-already-exist";

export const UpsertContainerNamespace = async (
    name: string,
    userId: string,
    description?: string,
): Promise<ContainerNamespace | null> => {
    const containerAPIInfo = GetContainersAPIInfo();

    try {
        const namespace = axios.post<{ namespace: ContainerNamespace | null }>(
            `${containerAPIInfo.url}/namespaces`,
            {
                name: name,
                description: description,
                userId: userId,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${containerAPIInfo.authToken}`,
                },
            },
        );
        return (await namespace).data.namespace;
    } catch (e: any) {
        if (e.response.status === 409) {
            throw new ContainerNamespaceAlreadyExistError(
                `Namespace with name '${name}' already exists`,
            );
        }
        console.log("Error creating namespace:", e);
        throw new UpsertContainerNamespaceError(
            `Error creating namespace '${name}' : ${e}`,
        );
    }
};
