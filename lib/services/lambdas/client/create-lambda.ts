import { LambdaCreateResponse } from "@/app/api/projects/[project]/services/lambdas/route";
import axios, { AxiosError } from "axios";
import { InternalServerError, StugaError } from "../../error/error";
import { LambdaCreateCandidate } from "@/lib/models/lambdas/lambda-create";

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
                message: e.response?.data?.error,
                status: e.response?.status ?? 500,
                error: e.response?.data?.error,
            });
        }
        throw InternalServerError(e);
    }
};
