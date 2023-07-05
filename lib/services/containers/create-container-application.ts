import { ContainerApplication } from "@/lib/models/containers/container-application";
import axios from "axios";
import { ContainerApplicationAlreadyExistError } from "@/lib/services/containers/errors/container-application-already-exist.error";
import { CreateContainerApplicationError } from "@/lib/services/containers/errors/create-container-application.error";
import { CreateContainerApplicationBody } from "@/lib/services/containers/create-container-application.body";
import { GetContainersAPIInfo } from "@/lib/services/containers/get-containers-api-info";

export const CreateContainerApplication = async (
    createContainerApplicationBody: CreateContainerApplicationBody,
): Promise<ContainerApplication | null> => {
    const containerAPIInfo = GetContainersAPIInfo();

    try {
        const application = await axios.post<{
            application: ContainerApplication;
            message: string;
        }>(
            `${containerAPIInfo.url}/applications`,
            createContainerApplicationBody,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${containerAPIInfo.authToken}`,
                },
            },
        );
        if (application.data.application) {
            return application.data.application;
        }
        return null;
    } catch (e: any) {
        console.log("Error creating application:", e);
        if (e.response.status === 409) {
            throw new ContainerApplicationAlreadyExistError(
                `Application '${createContainerApplicationBody.name}' already exists`,
            );
        } else {
            throw new CreateContainerApplicationError(
                `Error creating application '${createContainerApplicationBody.name}' : ${e}`,
            );
        }
    }
};
