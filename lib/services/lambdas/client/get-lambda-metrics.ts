import axios from "axios";
import { LambdaMetrics } from "../lambda-metrics";
import { InternalServerError } from "../../error/error";
export const GetLambdaMetrics = async ({
    lambdaId,
    projectId,
}: {
    lambdaId: string;
    projectId: string;
}): Promise<LambdaMetrics[]> => {
    try {
        const element = await axios.get(
            `/api/projects/${projectId}/services/lambdas/${lambdaId}/metrics`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.LISERK_API_KEY}`,
                },
            },
        );
        return element.data;
    } catch (e) {
        console.error(e);
        throw InternalServerError(e);
    }
};
