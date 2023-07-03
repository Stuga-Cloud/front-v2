import { Registry } from "@/lib/models/lambdas/lambda-create";
import { getLambdaImageInProject } from "@/lib/services/lambdas/get-lambda-image-in-user-namespaces";
import { getProjectNamespaces } from "../registry/namespace/get-project-namespaces";
import { StugaError } from "../error/error";
import { StugaErrorToNextResponse } from "../error/stuga-error-to-next-response";
import ResponseService from "@/lib/next-response";
import { checkIfDockerHubImageExists } from "../utils/check-if-docker-hub-image-exists";

export const verifyIfImageExists = async (
    imageName: string,
    projectId: string,
    registry: Registry,
    repository: string = "library",
) => {
    if (registry === "pcr") {
        console.log(registry)
        console.log(repository)
        console.log(imageName)
        console.log("pcr")
        try {
            const image = await getLambdaImageInProject({
                imageName: imageName,
                projectId: projectId,
                dependencies: {
                    getProjectNamespaces: getProjectNamespaces,
                },
            });
        } catch (e) {
            console.log(`Failed to get image ${imageName} in project ${projectId} in registry ${registry}`);
            console.log(e);
            if (e instanceof StugaError) {
                return StugaErrorToNextResponse(e);
            }
            return ResponseService.internalServerError(
                "internal-server-error",
                e,
            );
        }
    } else {
        try {
            const imageNameSplit = imageName.split(":");
            const imageExist = await checkIfDockerHubImageExists(
                repository,
                imageNameSplit[0],
                imageNameSplit[1],
            );
            if (!imageExist) {
                return ResponseService.notFound("image does not exist");
            }
        } catch (e) {
            console.log(`Failed to get image ${imageName} in project ${projectId} in registry ${registry}`);
            console.log(e);
            return ResponseService.internalServerError(
                "internal-server-error",
                e,
            );
        }
    }
};
