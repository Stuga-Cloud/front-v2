import axios from "axios";
import { InternalServerError } from "../../error/error";
import { LambdaMetrics } from "../lambda-metrics";


export const GetLambdaMetricsLiserk= async ({
    lambdaId,
}:{lambdaId: string}): Promise<LambdaMetrics[]> => {

    try {
        const element = await axios.get(
            process.env.LISERK_API_ENDPOINT +
                `/lambda/${lambdaId}/metric`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.LISERK_API_KEY}`,
                },
            },
        );
        return element.data.metrics;
    } catch (e) {
        console.error(e);
        throw InternalServerError(e);
    }
};