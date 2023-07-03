import { LambdaCreateResponse } from "@/app/api/projects/[project]/services/lambdas/route";
import axios, { AxiosError } from "axios";
import { InternalServerError, StugaError } from "../../error/error";
import { LambdaModel } from "@/lib/models/lambdas/lambda";

export const UpdateLambda = async (
    projectId: string,
    lambda: LambdaModel,
): Promise<void> => {
    try {
        await axios.put(
            `/api/projects/${projectId}/services/lambdas/${lambda.id}`,
            lambda,
        );
        console.log("après le put")
    } catch (e) {
        console.log("error");
        console.log(e);
        if (e instanceof AxiosError) {
            console.log("error axios");
            throw new StugaError({
                message: e.response?.data?.message,
                status: e.response?.status ?? 500,
                error: e.response?.data?.errors,
            });
        }
        throw InternalServerError(e);
    }
};
