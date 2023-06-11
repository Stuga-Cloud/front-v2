import axios, { AxiosError } from "axios";
import { InternalServerError, StugaError } from "../../error/error";
import { Lambda } from "@prisma/client";

export const GetLambdaById = async (
    projectId: string,
    lambdaId: string,
): Promise<Lambda> => {
    try {
        const result = await axios.get<Lambda>(
            `/api/projects/${projectId}/services/lambdas/${lambdaId}`,
        );
        return result.data;
    } catch (e) {
        if (e instanceof AxiosError) {
            throw new StugaError({
                message: e.response?.data?.message,
                status: e.response?.status ?? 500,
                error: e.response?.data?.errors,
            });
        }
        throw InternalServerError(e);
    }
};
