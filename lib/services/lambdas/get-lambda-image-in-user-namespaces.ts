import { RegistryNamespace } from "@prisma/client";
import { GetNamespaceImages } from "../registry/harbor/get-namespace-images";
import { InternalServerError, StugaError } from "../error/error";
import { ImageInformationsHarborResponse } from "@/app/api/registry/namespace/[namespace]/route";
export const getLambdaImageInProject = async ({
    imageName,
    projectId,
    dependencies: { getProjectNamespaces },
}: {
    imageName: string;
    projectId: string;
    dependencies: {
        getProjectNamespaces: ({
            projectId,
        }: {
            projectId: string;
        }) => Promise<RegistryNamespace[]>;
    };
}): Promise<ImageInformationsHarborResponse> => {
    try {
        const namespaces = await getProjectNamespaces({ projectId });
        const images = await Promise.all(
            namespaces.map((namespace) => GetNamespaceImages(namespace.name)),
        );
        const allImageNames = images.flat().map((image) => image);
        const image = allImageNames.find((image) => image.name === imageName);
        if (!image) {
            throw new StugaError({
                message: "image not found in all private namespaces",
                status: 404,
                error: "image-not-found-in-all-private-namespaces",
            });
        }

        return image;
    } catch (e) {
        if (e instanceof StugaError) {
            throw e;
        }
        return InternalServerError(e);
    }
};
