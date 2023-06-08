import { StugaError } from "@/lib/services/error/error";
import axios, { AxiosError } from "axios";

export const AddAccountInNamespace = async (
    projectId: string,
    namespaceId: string,
) => {
    try {
        await axios.post(
            `/api/projects/${projectId}/services/registry/${namespaceId}/users`,
        );
    } catch (e) {
        if (e instanceof AxiosError && e.status === 404) {
            throw new StugaError({
                message: "namespace not found",
                error: "namespace-not-found",
                status: 404,
            })
        }
        console.error(e);
        throw e;
    }
};
