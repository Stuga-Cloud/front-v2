import { FindContainerNamespaceError } from "@/lib/services/containers/errors/find-container-namespace.error";

export const GetContainersAPIInfo = (): {
    url: string;
    authToken: string;
} => {
    const containerAPI = process.env.CONTAINER_API;
    const containerAuthToken = process.env.CONTAINER_AUTH_TOKEN;
    if (!containerAPI) {
        throw new FindContainerNamespaceError(
            "Container API URL is not defined",
        );
    }
    if (!containerAuthToken) {
        throw new FindContainerNamespaceError(
            "Container API Auth Token is not defined",
        );
    }

    return {
        url: containerAPI,
        authToken: containerAuthToken,
    };
};
