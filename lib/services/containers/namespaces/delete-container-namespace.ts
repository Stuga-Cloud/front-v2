import { ContainerNamespace } from "@/lib/models/containers/container-namespace";
import axios from "axios";
import { GetContainersAPIInfo } from "@/lib/services/containers/get-containers-api-info";
import { DeleteContainerNamespaceError } from "@/lib/services/containers/errors/delete-container-namespace.error";

export const DeleteContainerNamespace = async (
    namespaceId: string,
    userId: string,
): Promise<ContainerNamespace | null> => {
    const containerAPIInfo = GetContainersAPIInfo();

    try {
        const namespace = axios.delete<{
            namespace: ContainerNamespace | null;
        }>(
            `${containerAPIInfo.url}/namespaces/${namespaceId}?userId=${userId}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${containerAPIInfo.authToken}`,
                },
            },
        );
        if ((await namespace).status !== 200) {
            throw new DeleteContainerNamespaceError(
                `Error deleting namespace '${namespaceId}' : ${
                    (await namespace).status
                }`,
            );
        }
        return (await namespace).data.namespace;
    } catch (e) {
        console.log("Error deleting namespace:", e);
        throw new DeleteContainerNamespaceError(
            `Error creating namespace '${namespaceId}' : ${e}`,
        );
    }
};
