import { ContainerApplicationNamespace } from "@/lib/models/containers/container-application-namespace";
import axios from "axios";
import { UpsertContainerNamespaceError } from "@/lib/services/containers/errors/upsert-container-namespace.error";
import { GetContainersAPIInfo } from "@/lib/services/containers/get-containers-api-info";
import { ContainerNamespaceNotFoundError } from "@/lib/services/containers/errors/container-namespace-not-found";

export const UpdateContainerNamespace = async (
    namespaceId: string,
    description: string = "",
    userId: string,
    userIdWhoUpdates: string,
): Promise<ContainerApplicationNamespace | null> => {
    const containerAPIInfo = GetContainersAPIInfo();

    try {
        const namespace = axios.put<{
            namespace: ContainerApplicationNamespace | null;
        }>(
            `${containerAPIInfo.url}/namespaces/${namespaceId}?userId=${userIdWhoUpdates}`,
            {
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
        console.log("Error updating namespace:", e);
        if (e.response.status === 404) {
            throw new ContainerNamespaceNotFoundError(
                `Namespace not found with id ${namespaceId}`,
            );
        }
        throw new UpsertContainerNamespaceError(
            `Error updating namespace '${name}' : ${e}`,
        );
    }
};
