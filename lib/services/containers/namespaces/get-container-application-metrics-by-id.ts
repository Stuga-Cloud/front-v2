import axios from "axios";
import { GetContainersAPIInfo } from "@/lib/services/containers/get-containers-api-info";
import { FindContainerApplicationError } from "@/lib/services/containers/errors/find-container-application.error";
import { ContainerApplicationMetrics } from "@/lib/models/containers/container-application-metrics";

export const GetContainerApplicationMetricsByID = async (
    applicationId: string,
    userId: string,
): Promise<ContainerApplicationMetrics[]> => {
    const containerAPIInfo = GetContainersAPIInfo();
    try {
        const namespace = await axios.get(
            `${containerAPIInfo.url}/applications/${applicationId}/metrics?userId=${userId}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${containerAPIInfo.authToken}`,
                },
            },
        );
        return namespace.data.metrics;
    } catch (e: any) {
        console.log(`Error getting application metrics '${applicationId}' : ${e}`);
        if (e.response.status === 404) {
            throw new FindContainerApplicationError(
                `Application with id '${applicationId}' not found`,
                404,
            );
        }
        if (e.response.status === 500) {
            throw new FindContainerApplicationError(
                `Error getting application '${applicationId}' metrics : ${e}`,
            );
        }
        if (e.response.status === 403) {
            throw new FindContainerApplicationError(
                `User with id '${userId}' is not authorized to get application '${applicationId}' metrics`,
                403,
            );
        }
        if (e.response.status === 401) {
            throw new FindContainerApplicationError(
                `Not authorized to get application '${applicationId}' metrics`,
                401,
            );
        }

        throw new FindContainerApplicationError(
            `Error getting application '${applicationId}' metrics : ${e}`,
        );
    }
};
