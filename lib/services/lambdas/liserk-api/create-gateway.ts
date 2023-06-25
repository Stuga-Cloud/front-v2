import axios from "axios";
import { InternalServerError } from '../../error/error';

export interface CreateGatewayDto {
    projectName: string;
    lambdaId: string;
    lambdaName: string;
    visibility: "public" | "private";
}


export const CreateGateway = async (createGatewayDto: CreateGatewayDto) => {

    try {
        await axios.post(
            process.env.LISERK_API_ENDPOINT +
                `/gateways`,
                createGatewayDto,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.LISERK_API_KEY}`,
                },
            },
        );
    } catch (e) {
        console.error(e);
        throw InternalServerError(e);
    }
};