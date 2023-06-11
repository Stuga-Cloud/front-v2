import axios, { AxiosError } from "axios";
import { InternalServerError, StugaError } from "../../error/error";
import { Lambda } from "@prisma/client";

export const GetLambdas = async (projectId: string): Promise<Lambda[]> => {
    try {
        const result = await axios.get<Lambda[]>(
            `/api/projects/${projectId}/services/lambdas`,
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
