import axios from "axios";

export const GetAccountInRegistry = async (
    projectId: string,
): Promise<{ user_id: number; username: string }> => {
    try {
        const userJson = await axios.get(
            `/api/projects/${projectId}/services/registry/users`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
        const userFromJson = await userJson.data;
        return userFromJson;
    } catch (error) {
        console.log(error)
        throw error;
    }
};
