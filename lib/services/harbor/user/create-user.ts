import axios, { AxiosError } from "axios";
import { HarborUser, GetUser } from "./get-user";
import { InternalServerError } from "../../error/error";
import { NextResponse } from "next/server";

export const CreateUser = async (
    email: string,
    password: string,
): Promise<HarborUser | null> => {
    try {
        await axios.post(
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
        return await GetUser(email);
    } catch (e) {
        throw InternalServerError;
    }
};
