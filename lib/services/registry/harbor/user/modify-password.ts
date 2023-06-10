import axios from "axios";
import { HarborUser, GetUser } from "./get-user";
import { InternalServerError, StugaError } from "../error/error";

export const ModifyUserPassword = async (
    oldPassword: string,
    password: string,
    userInHarbor: {
        user_id: number;
        username: string;
    },
): Promise<HarborUser> => {
    try {
        await axios.put(
            process.env.BASE_REGISTRY_ENDPOINT +
                `/api/v2.0/users/${userInHarbor.user_id}/password`,
            {
                old_password: oldPassword,
                new_password: password,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Basic ${process.env.REGISTRY_AUTH_TOKEN}`,
                },
            },
        );
        const user = await GetUser(userInHarbor.username);
        if (!user) {
            throw new StugaError({
                error: "user-not-found",
                message: "user " + userInHarbor.username + " not found",
                status: 404,
            });
        }
        return user;
    } catch (e) {
        console.log("error in modify-password");
        throw InternalServerError;
    }
};
