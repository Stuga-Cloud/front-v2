import { ContainerApplication } from "@/lib/models/containers/container-application";
import axios from "axios";
import { ContainerApplicationAlreadyExistError } from "@/lib/services/containers/errors/container-application-already-exist.error";
import { CreateContainerApplicationError } from "@/lib/services/containers/errors/create-container-application.error";
import { CreateContainerApplicationBody } from "@/lib/services/containers/create-container-application.body";

export const CreateContainerApplication = async (
    createContainerApplicationBody: CreateContainerApplicationBody,
): Promise<ContainerApplication | null> => {
    try {
        const application = await axios.post<ContainerApplication>(
            `${process.env.CONTAINER_API}/applications`,
            createContainerApplicationBody,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.CONTAINER_AUTH_TOKEN}`,
                },
            },
        );
        return application.data;
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
