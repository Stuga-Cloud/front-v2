import axios, { AxiosError } from "axios";

export async function checkIfDockerHubImageExists(
    repository: string,
    image: string,
    tag: string,
): Promise<boolean> {
    try {
        const dockerHubUsername = process.env.DOCKER_HUB_REGISTRY_USERNAME;
        const dockerHubPassword = process.env.DOCKER_HUB_REGISTRY_PASSWORD;
        if (!dockerHubUsername || !dockerHubPassword) {
            console.error(
                `You have to define DOCKER_HUB_REGISTRY_USERNAME and DOCKER_HUB_REGISTRY_PASSWORD environment variables to check if image ${image}:${tag} exists on Docker Hub`,
            );
            return false;
        }
        const tokenResponse = await axios.get(
            `https://auth.docker.io/token?service=registry.docker.io&scope=repository:${repository}/${image}:pull`,
            {
                auth: {
                    username: dockerHubUsername,
                    password: dockerHubPassword,
                },
            },
        );

        const token = tokenResponse.data.token;

        const response = await axios.get(
            `https://index.docker.io/v2/${repository}/${image}/manifests/${tag}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/vnd.oci.image.index.v1+json",
                },
            },
        );

        if (response.status === 200) {
            return true;
        }
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response && error.response.status === 404) {
                console.log(
                    `Image ${image}:${tag} does not exist on Docker Hub in repository ${repository}`,
                );
            } else {
                console.error(
                    "An error occurred while checking the image:",
                    JSON.stringify(error.response?.data, null, 4),
                );
            }
        } else {
            console.log("Error while checking image:", error);
        }
        return false;
    }
    return false;
}
