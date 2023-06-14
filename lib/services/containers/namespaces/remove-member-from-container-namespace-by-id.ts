import axios from "axios";
import { GetContainersAPIInfo } from "@/lib/services/containers/get-containers-api-info";
import { RemoveMemberFromContainerNamespaceError } from "@/lib/services/containers/errors/remove-member-from-container-namespace.error";

export const RemoveMemberFromContainerNamespace = async (
    namespaceId: string,
    userId: string,
    removedBy: string,
): Promise<void> => {
    const containerAPIInfo = GetContainersAPIInfo();
    try {
        await axios.delete(
            `${containerAPIInfo.url}/namespaces/${namespaceId}/memberships/${userId}?removedBy=${removedBy}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${containerAPIInfo.authToken}`,
                },
            },
        );
    } catch (e: any) {
        console.log(
            `Error deleting member ${userId} from namespace ${namespaceId}`,
        );
        console.log(e);
        if (e.response.status === 404) {
            throw new RemoveMemberFromContainerNamespaceError(
                `Member with id '${userId}' not found in namespace '${namespaceId}'`,
            );
        }
        if (e.response.status === 500) {
            throw new RemoveMemberFromContainerNamespaceError(
                `Error removing member '${userId}' from namespace '${namespaceId}' : ${e}`,
            );
        }
        if (e.response.status === 403) {
            throw new RemoveMemberFromContainerNamespaceError(
                `User with id '${removedBy}' is not authorized to remove member '${userId}' from namespace '${namespaceId}'`,
            );
        }
        if (e.response.status === 401) {
            throw new RemoveMemberFromContainerNamespaceError(
                `Not authorized to remove member '${userId}' from namespace '${namespaceId}'`,
            );
        }

        throw new RemoveMemberFromContainerNamespaceError(
            `Error removing member '${userId}' from namespace '${namespaceId}' : ${e}`,
        );
    }
};
