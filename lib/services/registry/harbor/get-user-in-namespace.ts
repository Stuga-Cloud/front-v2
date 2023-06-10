import axios from "axios";

export interface GetMemberInNamespaceResponse {
    entity_id: number;
    entity_name: string;
    entity_type: string;
    id: number;
    project_id: number;
    role_id: number;
    role_name: string;
}

export const GetUserInNamespace = async (
    namespaceName: string,
    userId: number,
): Promise<{ userId: number; username: string } | null> => {
    try {
        const req = await axios.get<GetMemberInNamespaceResponse[]>(
            process.env.BASE_REGISTRY_ENDPOINT +
                `/api/v2.0/projects/${namespaceName}/members?page=1&page_size=10`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Basic ${process.env.REGISTRY_AUTH_TOKEN}`,
                },
            },
        );
        const usersInNamespace = req.data;

        const user = usersInNamespace.find((user) => user.entity_id === userId);

        if (!user) {
            return null;
        }
        return {
            userId: user.entity_id,
            username: user.entity_name,
        };
    } catch (e) {
        console.error(e);
        throw e;
    }
};
