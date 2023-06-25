import axios, { AxiosError } from "axios";
import { InternalServerError } from "../../error/error";
import ResponseService from '../../../next-response';
import { error } from "console";

export const DeletGatewayProject = async ({
    projectName,
}: {
    projectName: string;
}) => {
    try {
        await axios.delete(
            process.env.LISERK_API_ENDPOINT +
                `/gateways/${projectName}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.LISERK_API_KEY}`,
                },
            },
        );
    } catch (e) {
        if (e instanceof AxiosError && e.response?.status === 404) {
            console.error("project not found");
            throw ResponseService.notFound("project not found", error);
        }
        console.error(e);
        throw InternalServerError(e);
    }
};
