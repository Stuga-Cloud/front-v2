import { Registry } from "@/lib/models/lambdas/lambda-create";
import { getLambdaImageInProject } from '@/lib/services/lambdas/get-lambda-image-in-user-namespaces';
import { getProjectNamespaces } from "../registry/namespace/get-project-namespaces";
import { StugaError } from "../error/error";
import { StugaErrorToNextResponse } from "../error/stuga-error-to-next-response";
import ResponseService from "@/lib/next-response";
import { checkIfDockerHubImageExists } from "../utils/check-if-docker-hub-image-exists";

export const verifyIfImageExists = async (
    imageName: string,
    projectId: string,
    registry: Registry,
) => {
    if (registry === "pcr") {
        try {
            const image = await getLambdaImageInProject({
                imageName: imageName,
                projectId: projectId,
                dependencies: {
                    getProjectNamespaces: getProjectNamespaces,
                },
            });
        } catch (e) {
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
                imageNameSplit[0],
                imageNameSplit[1],
            );
            if (!imageExist) {
                return ResponseService.notFound("image does not exist");
            }
        } catch (e) {
            return ResponseService.internalServerError(
                "internal-server-error",
                e,
            );
        }
    }
};