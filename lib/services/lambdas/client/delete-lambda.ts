import { AxiosError } from "axios";
import { InternalServerError, StugaError } from "../../error/error";
import axios from 'axios';

export const DeleteLambda = async ({lambdaId, projectId}:{
    lambdaId: string,
    projectId: string,
}): Promise<void> => {
    try {
        const result = await axios.delete<void>(
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