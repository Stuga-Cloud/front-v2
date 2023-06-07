import { ContainerNamespace } from "@/lib/models/containers/container-namespace";
import axios from "axios";
import { UpsertContainerNamespaceError } from "@/lib/services/errors/upsert-container-namespace.error";

export const GetContainerNamespaceByName = async (
    name: string,
): Promise<ContainerNamespace | null> => {
    try {
        const namespace = await axios.get<ContainerNamespace>(
            `${process.env.CONTAINER_API}/api/v2.0/namespaces?name=${name}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Basic ${process.env.CONTAINER_AUTH_TOKEN}`,
                },
            },
        );
        return namespace.data;
    } catch (e) {
        throw new UpsertContainerNamespaceError(
            `Error getting namespace '${name}' : ${e}`,
        );
    }
};
