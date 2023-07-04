import { ContainerApplication } from "@/lib/models/containers/container-application";
import axios, { AxiosError } from "axios";
import { GetContainersAPIInfo } from "@/lib/services/containers/get-containers-api-info";
import { UpdateContainerApplicationBody } from "@/lib/services/containers/update-container-application.body";
import { UpdateContainerApplicationError } from "@/lib/services/containers/errors/update-container-application.error";
import { UnauthorizedToUpdateApplicationError } from "./errors/unauthorize-to-update-applicatioon.error";

export const UpdateContainerApplication = async (
    applicationId: string,
    userId: string,
    updateContainerApplicationBody: UpdateContainerApplicationBody,
): Promise<ContainerApplication | null> => {
    const containerAPIInfo = GetContainersAPIInfo();

    try {
        const application = await axios.put<{
            application: ContainerApplication;
            message: string;
        }>(
            `${containerAPIInfo.url}/applications/${applicationId}?userId=${userId}`,
            updateContainerApplicationBody,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${containerAPIInfo.authToken}`,
                },
            },
        );
        return application.data.application;
    } catch (e: any) {
        if (e instanceof AxiosError) {
            if (e.response?.status === 404) {
                return null;
            }
            if (e.response?.status === 403 || e.response?.status === 401) {
                throw new UnauthorizedToUpdateApplicationError(
                    `User ${userId} is not authorized to access namespace ${updateContainerApplicationBody.namespaceId}`,
                );
            }
        }
        console.log("Error updating application:", e);
        throw new UpdateContainerApplicationError(
            `Error updating application '${updateContainerApplicationBody.name}' : ${e}`,
        );
    }
};
