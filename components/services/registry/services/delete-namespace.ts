import { InternalServerError, StugaError } from "@/lib/services/error/error";
import axios, { AxiosError } from "axios";

export const DeleteNamespace = async (
    namespaceId: string,
    projectId: string,
) => {
    try {
        await axios.delete(
            `/api/projects/${projectId}/services/registry/${namespaceId}`,
        );
    } catch (e) {
        if (e instanceof AxiosError) {
            throw new StugaError({
                message: e.response?.data?.message,
                status: e.response?.status ?? 500,
                error: e.response?.data?.errors,
            });
        }
        throw InternalServerError;
    }
};
