import axios from "axios";

export const ModifyPassword = async (
    projectId: string,
    password: string,
    oldPassword: string,
) => {
    try {
        await axios.patch(
            `/api/projects/${projectId}/services/registry/users/password`,
            { password, oldPassword },
        );
    } catch (e) {
        console.log("error in modify password")
        console.log(e);
        throw e;
    }
};
