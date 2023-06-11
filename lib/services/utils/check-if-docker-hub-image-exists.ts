import axios, { AxiosError } from "axios";

export async function checkIfDockerHubImageExists(image: string, tag: string): Promise<boolean> {
  try {
    const tokenResponse = await axios.get(
      `https://auth.docker.io/token?service=registry.docker.io&scope=repository:library/${image}:pull`,
      {
        auth: {
          username: process.env.DOCKER_HUB_REGISTRY_USERNAME || "you have to defined it",
          password: process.env.DOCKER_HUB_REGISTRY_PASSWORD || "you have to defined it",
        },
      }
    );

    const token = tokenResponse.data.token;

    const response = await axios.get(
      `https://index.docker.io/v2/library/${image}/manifests/${tag}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.docker.distribution.manifest.v2+json",
        },
      }
    );

    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response && error.response.status === 404) {
        console.log(`Image ${image}:${tag} does not exist on Docker Hub`);
      } else {
        console.error(
          "An error occurred while checking the image:",
          error.response?.data
        );
      }
    }
    return false;
  }
  return false;
}
