import axios, { Axios, AxiosError } from "axios";
import { InternalServerError } from "../../error/error";

export interface InitLambdaImageDto {
    id: string;
    image_name: string;
    ram_mega: number;
    max_time: number;
    cpu: number;
    storage_mega: number;
    minimum_instance_number: number;
    maximum_instance_number: number;
}

export const InitLambdaImage = async (
    initLambdaImageDto: InitLambdaImageDto,
) => {
    try {
        await axios.post(
            process.env.LISERK_API_ENDPOINT + `/images`,
            initLambdaImageDto,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.LISERK_API_KEY}`,
                },
            },
        );
    } catch (e) {
        if (e instanceof AxiosError) {
            console.error(e.response?.data);
        }
        throw InternalServerError(e);
    }
};
