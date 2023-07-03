import axios from "axios";
export const CreateUserInRegistry = async (
    projectId: string,
    password: string,
) => {
    try {
        await axios.post(`/api/projects/${projectId}/services/registry/users`, {
            password,
        });
    } catch (error) {
        console.log(error)
        throw error;
    }
};
