import axios from "axios";
import { GetContainersAPIInfo } from "@/lib/services/containers/get-containers-api-info";
import { FindContainerApplicationError } from "@/lib/services/containers/errors/find-container-application.error";
import { ContainerApplicationLogs } from "@/lib/models/containers/container-application-logs";

export const GetContainerApplicationLogsByID = async (
    applicationId: string,
    userId: string,
): Promise<ContainerApplicationLogs[] | null> => {
    const containerAPIInfo = GetContainersAPIInfo();
    try {
        const namespace = await axios.get(
            `${containerAPIInfo.url}/applications/${applicationId}/logs?userId=${userId}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${containerAPIInfo.authToken}`,
                },
            },
        );
        return namespace.data.logs;
    } catch (e: any) {
        console.log(`Error getting application logs '${applicationId}' : ${e}`);
        if (e.response.status === 404) {
            throw new FindContainerApplicationError(
                `Application with id '${applicationId}' not found`,
                404,
            );
        }
        if (e.response.status === 500) {
            throw new FindContainerApplicationError(
                `Error getting application '${applicationId}' logs : ${e}`,
            );
        }
        if (e.response.status === 403) {
            throw new FindContainerApplicationError(
                `User with id '${userId}' is not authorized to get application '${applicationId}' logs`,
                403,
            );
        }
        if (e.response.status === 401) {
            throw new FindContainerApplicationError(
                `Not authorized to get application '${applicationId}' logs`,
                401,
            );
        }

        throw new FindContainerApplicationError(
            `Error getting application '${applicationId}' logs : ${e}`,
        );
    }
};
