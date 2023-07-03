import axios from "axios";
import { InternalServerError } from "../../error/error";
import { InitApiKeyResponse } from "./init-lambda-api-key-gateway";


export const GetAPiKey = async ({
    projectName,
}:{projectName: string}): Promise<InitApiKeyResponse> => {

    try {
        const element = await axios.get(
            process.env.LISERK_API_ENDPOINT +
                `/gateways/${projectName}/apikey`,
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