import ResponseService from '@/lib/next-response';
import axios, { AxiosError } from 'axios';
import { InternalServerError } from '../../error/error';

export const DeleteLambda = async ({
    lambdaId,
}: {
    lambdaId: string;
}) => {
    try {
        await axios.delete(
            process.env.LISERK_API_ENDPOINT +
                `/lambda/${lambdaId}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.LISERK_API_KEY}`,
                },
            },
        );
    } catch (e) {
        if (e instanceof AxiosError && e.response?.status === 404) {
            console.error("lambda not found");
            throw ResponseService.notFound("project not found", e);
        }
        console.error(e);
        throw InternalServerError(e);
    }
};