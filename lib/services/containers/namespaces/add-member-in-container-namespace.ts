import axios from "axios";
import { GetContainersAPIInfo } from "@/lib/services/containers/get-containers-api-info";
import { ContainerNamespaceMembershipRole } from "@/lib/models/containers/container-application-namespace-membership";
import { AddMemberToContainerNamespaceError } from "@/lib/services/containers/errors/add-member-to-container-namespace.error";

export const AddMemberInContainerNamespace = async (
    namespaceId: string,
    userId: string,
    addedBy: string,
    role: ContainerNamespaceMembershipRole,
): Promise<any> => {
    const containerAPIInfo = GetContainersAPIInfo();
    try {
        const membershipResponse = await axios.post(
            `${containerAPIInfo.url}/namespaces/${namespaceId}/memberships`,
            {
                userId,
                addedBy,
                role,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${containerAPIInfo.authToken}`,
                },
            },
        );
        return membershipResponse.data;
    } catch (e: any) {
        console.log(
            `Error adding member ${userId} to namespace ${namespaceId} : ${e}`,
        );
        if (e.response.status === 404) {
            throw new AddMemberToContainerNamespaceError(
                `Namespace with id '${namespaceId}' not found`,
            );
        }
        if (e.response.status === 500) {
            throw new AddMemberToContainerNamespaceError(
                `Error adding member '${userId}' to namespace '${namespaceId}' - ${e}`,
            );
        }
        if (e.response.status === 403) {
            throw new AddMemberToContainerNamespaceError(
                `User with id '${addedBy}' is not authorized to add member '${userId}' to namespace '${namespaceId} - ${e}'`,
            );
        }
        if (e.response.status === 401) {
            throw new AddMemberToContainerNamespaceError(
                `Not authorized to add member '${userId}' to namespace '${namespaceId} - ${e}'`,
            );
        }

        throw new AddMemberToContainerNamespaceError(
            `Error adding member '${userId}' to namespace '${namespaceId}' - ${e}`,
        );
    }
};
