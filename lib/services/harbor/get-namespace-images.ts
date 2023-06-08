import axios, { AxiosError } from "axios";
import { InternalServerError, StugaError } from "../error/error";

export interface ImageInformationsHarborResponse {
    artifact_count: number;
    creation_time: string;
    id: number;
    name: string;
    project_id: number;
    pull_count: number;
    update_time: string;
}

export const GetNamespaceImages = async (namespaceName: string): Promise<ImageInformationsHarborResponse[]> => {
    try {

        const res: ImageInformationsHarborResponse[] = await axios.get(
            process.env.BASE_REGISTRY_ENDPOINT +
                `/api/v2.0/projects/${namespaceName}/repositories?page_size=30&page=1`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Basic ${process.env.REGISTRY_AUTH_TOKEN}`,
                },
            },
        );
        return res;
    } catch (e) {
        if (e instanceof AxiosError) {
            throw new StugaError({
                message: e.response?.data?.message,
                status: e.response?.status ?? 500,
                error: e.response?.data?.errors,
            });
        }
        throw InternalServerError;
    }
};