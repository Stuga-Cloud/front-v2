import axios, { AxiosError } from "axios";
import { InternalServerError, StugaError } from "../error";
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

        console.log(reqForUser.data);
        const usersFromHarbor: {
            user_id: number;
            username: string;
        }[] = reqForUser.data;

        console.log("users");
        console.log(usersFromHarbor);
        const userInHarbor = usersFromHarbor.find(
            (user) => user.username === email,
        );

        console.log("userInHarbor");
        console.log(userInHarbor);

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

export const getUserOrCreateItInHarbor = async (
    email: string,
    password: string,
): Promise<{
    user_id: number;
    username: string;
}> => {
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

        console.log(reqForUser.data);
        const usersFromHarbor: {
            user_id: number;
            username: string;
        }[] = reqForUser.data;

        console.log("users");
        console.log(usersFromHarbor);
        const userInHarbor = usersFromHarbor.find(
            (user) => user.username === email,
        );

        console.log("userInHarbor");
        console.log(userInHarbor);

        if (!userInHarbor) {
            const request = await axios.post(
                `${process.env.BASE_REGISTRY_ENDPOINT}/api/v2.0/users`,
                {
                    comment: email,
                    username: email,
                    password: password,
                    email: email,
                    realname: email,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Basic ${process.env.REGISTRY_AUTH_TOKEN}`,
                    },
                },
            );
            console.log("request");
            // console.log(request.data.errors);
            return request.data;
        }
        return userInHarbor;
    } catch (e) {
        if (e instanceof AxiosError) {
            // console.log(e);
            console.log(
                "-------------------------------------------------------",
            );
            // console.log(e.response);
            console.log(e.response?.data);
            console.log(e.response?.headers);
            console.log(e.response?.status);
        }
        throw e;
    }
};
