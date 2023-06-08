import axios, { AxiosError } from "axios";
import { InternalServerError, StugaError } from '@/lib/services/error/error';

export const DeleteImageInNamespace = async ({
    namespaceName,
    imageName,
}: {
    namespaceName: string;
    imageName: string;
}) => {

    try {
        const result = await axios.delete(
            process.env.BASE_REGISTRY_ENDPOINT +
                `/api/v2.0/projects/${namespaceName}/repositories/${imageName}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Basic ${process.env.REGISTRY_AUTH_TOKEN}`,
                },
            },
        );
        return result;
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
