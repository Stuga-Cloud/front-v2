import axios, { AxiosError } from "axios";
import { InternalServerError } from "../../error/error";

export interface InitApiKeyResponse {
    apiKey: string;
}

export const InitApiKey = async ({
    projectName,
}: {
    projectName: string;
}): Promise<InitApiKeyResponse> => {
    try {
        const res = await axios.post<InitApiKeyResponse>(
            process.env.LISERK_API_ENDPOINT + `/gateways/${projectName}/apikey`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.LISERK_API_KEY}`,
                },
            },
        );

        return res.data;
    } catch (e) {
        console.error(e);
        throw InternalServerError(e);
    }
};
