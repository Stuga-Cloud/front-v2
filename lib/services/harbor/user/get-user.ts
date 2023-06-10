import axios, { AxiosError } from "axios";
import { InternalServerError, StugaError } from "../../error/error";
export interface HarborUser {
    user_id: number;
    username: string;
}

export const GetUser = async (email: string): Promise<HarborUser | null> => {
    try {
        const reqForUser = await axios.get(
            process.env.BASE_REGISTRY_ENDPOINT +
                `/api/v2.0/users/search?page=1&page_size=15&username=${email}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Basic ${process.env.REGISTRY_AUTH_TOKEN}`,
                },
            },
        );

        const usersFromHarbor: {
            user_id: number;
            username: string;
        }[] = reqForUser.data;

        const userInHarbor = usersFromHarbor.find(
            (user) => user.username === email,
        );

        return userInHarbor ?? null;
    } catch (e) {
        console.log("problem in get-user");
        if (e instanceof AxiosError) {
            throw new StugaError({
                message: e.message,
                status: e.response?.status!,
                error: "get-user-prolem",
            });
        }
        throw InternalServerError;
    }
};
