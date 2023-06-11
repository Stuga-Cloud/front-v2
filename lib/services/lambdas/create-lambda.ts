import { LambdaCreateResponse } from "@/app/api/projects/[project]/services/lambdas/route";
import { LambdaCreateCandidate } from "@/components/services/lambdas/create/types/lambda-create";
import axios, { AxiosError } from "axios";
import { InternalServerError, StugaError } from "../error/error";

export const CreateLambda = async (
    projectId: string,
    lambdaCreateCandidate: LambdaCreateCandidate,
): Promise<string> => {
    try {
        const result = await axios.post<LambdaCreateResponse>(
            `/api/projects/${projectId}/services/lambdas`,
            lambdaCreateCandidate,
        );
        return result.data.name;
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
