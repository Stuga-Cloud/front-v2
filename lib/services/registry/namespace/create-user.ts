export const CreateUserInRegistry = async (
    projectId: string,
    password: string,
) => {
    await fetch(`/api/projects/${projectId}/services/registry/users`, {
        method: "POST",
        body: JSON.stringify({ password }),
    });
};
