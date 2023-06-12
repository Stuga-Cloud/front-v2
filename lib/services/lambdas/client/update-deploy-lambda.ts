import axios, { AxiosError } from "axios";
import { InternalServerError, StugaError } from "../../error/error";
import { Lambda } from "@prisma/client";
import { LambdaModel } from "@/lib/models/lambdas/lambda";

export const UpdateDeployLambda = async (projectId: string, lambda: LambdaModel): Promise<void> => {
    try {
         await axios.post<Lambda[]>(
            `/api/projects/${projectId}/services/lambdas/${lambda.id}/update-deploy`,
            lambda,
        );
        
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
