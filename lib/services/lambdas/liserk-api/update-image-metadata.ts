import { AxiosError } from "axios";
import { InternalServerError } from "../../error/error";
import { InitLambdaImageDto } from "./init-lambda-image";
import axios from "axios";

export const UpdateImageMetadata = async (
    initLambdaImageDto: InitLambdaImageDto,
) => {
    console.log("update image metadata");
    try {
        const result = await axios.put(
            process.env.LISERK_API_ENDPOINT + `/images/metadata`,
            initLambdaImageDto,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.LISERK_API_KEY}`,
                },
            },
        );
        console.log(result.data);
    } catch (e) {
        if (e instanceof AxiosError) {
            console.error(e.response?.data);
        }
        throw InternalServerError(e);
    }
};
