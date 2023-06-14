import { ContainerApplicationNamespace } from "@/lib/models/containers/container-application-namespace";
import axios from "axios";
import { FindContainerNamespaceError } from "@/lib/services/containers/errors/get-container-namespace.error";
import { GetContainersAPIInfo } from "@/lib/services/containers/get-containers-api-info";

export const GetContainerNamespaceByID = async (
    namespaceId: string,
    userId: string,
): Promise<ContainerApplicationNamespace | null> => {
    const containerAPIInfo = GetContainersAPIInfo();
    try {
        const namespace = await axios.get<{
            namespace: ContainerApplicationNamespace;
        }>(
            `${containerAPIInfo.url}/namespaces/${namespaceId}?userId=${userId}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${containerAPIInfo.authToken}`,
                },
            },
        );
        return namespace.data.namespace;
    } catch (e: any) {
        console.log(`Error getting namespace with id '${namespaceId}' : ${e}`);
        if (e.response.status === 404) {
            throw new FindContainerNamespaceError(
                `Namespace with id '${namespaceId}' not found`,
            );
        }
        if (e.response.status === 500) {
            throw new FindContainerNamespaceError(
                `Error getting namespace '${namespaceId}' : ${e}`,
            );
        }
        if (e.response.status === 403) {
            throw new FindContainerNamespaceError(
                `User with id '${userId}' is not authorized to get namespace '${namespaceId}'`,
            );
        }
        if (e.response.status === 401) {
            throw new FindContainerNamespaceError(
                `Not authorized to get namespace '${namespaceId}'`,
            );
        }

        throw new FindContainerNamespaceError(
            `Error getting namespace '${namespaceId}' : ${e}`,
        );
    }
};
