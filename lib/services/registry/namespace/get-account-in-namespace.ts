import axios from "axios";

export const GetAccountInNamespace = async (
    namespaceId: string,
): Promise<{ userId: number; username: string } | null> => {
    try {

        const user = await axios.get(
            `/api/registry/namespace/${namespaceId}/users`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );

        return user.data;
    } catch (e) {
        console.error(e);
        throw e;
    }   
};
