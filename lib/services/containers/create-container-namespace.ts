import { ContainerNamespace } from "@/lib/models/containers/container-namespace";
import axios from "axios";
import { UpsertContainerNamespaceError } from "@/lib/services/containers/errors/upsert-container-namespace.error";
import { FindContainerNamespaceByName } from "@/lib/services/containers/get-container-namespace";
import { GetContainersAPIInfo } from "@/lib/services/containers/get-containers-api-info";

export const UpsertContainerNamespace = async (
    name: string,
    description: string,
    userId: string,
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
        if ((await namespace).status === 409) {
            return await FindContainerNamespaceByName(name, userId);
        }
        return (await namespace).data.namespace;
    } catch (e) {
        console.log("Error creating namespace:", e);
        throw new UpsertContainerNamespaceError(
            `Error creating namespace '${name}' : ${e}`,
        );
    }
};
