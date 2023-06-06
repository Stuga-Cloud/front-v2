export const ModifyPassword = async (
    projectId: string,
    password: string,
    oldPassword: string,
) => {
    await fetch(
        `/api/projects/${projectId}/services/registry/users/password`,
        {
            method: "PATCH",
            body: JSON.stringify({ password, oldPassword }),
        },
    );
};