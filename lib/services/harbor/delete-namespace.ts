import axios, { AxiosError } from "axios";
import { InternalServerError, StugaError } from "../error/error";

export const DeleteNamespace = async (namespaceName: string) => {
    try {
        await axios.delete(
            `${process.env.BASE_REGISTRY_ENDPOINT}/api/v2.0/projects/${namespaceName}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Basic ${process.env.REGISTRY_AUTH_TOKEN}`,
                },
            },
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
