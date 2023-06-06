import { Namespace } from "@/lib/models/registry/namespace";
import { RegistryNamespace } from "@prisma/client";
import axios from "axios";
import { InternalServerError } from "../error";

export interface GetMemberResponse {
    entity_id: number;
    entity_name: string;
    entity_type: string;
    id: number;
    project_id: number;
    role_id: number;
    role_name: string;
}

export const AddUserInNamespace = async (
    userId: number,
    namespace: RegistryNamespace,
) => {
    try {
        const req = await axios.post(
            process.env.BASE_REGISTRY_ENDPOINT +
                `/api/v2.0/projects/${namespace.name}/members`,
            {
                role_id: 1,
                member_user: {
                    user_id: userId,
                },
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Basic ${process.env.REGISTRY_AUTH_TOKEN}`,
                },
            },
        );
    } catch (e) {
        console.error(e);
        throw InternalServerError;
    }
};
