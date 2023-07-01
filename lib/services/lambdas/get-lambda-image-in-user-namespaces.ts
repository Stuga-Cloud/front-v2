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
}): Promise<string> => {
    try {
        const imageSearch = imageName.split(":")[0];
        console.log("imageSearch")
        console.log(imageSearch)
        const namespaces = await getProjectNamespaces({ projectId });
        const images = await Promise.all(
            namespaces.map(async (namespace) => ({
                name: namespace.name,
                images: await GetNamespaceImages(namespace.name),
            })),
        );
        
        const imagesFormat = images.map((imageF) => imageF.images.map((image) => `${imageF.name}/${image.name}`));
        const allImageNames = imagesFormat.flat().map((image) => image);
        console.log("allImageNames");
        console.log(allImageNames);
        const image = allImageNames.find((image) => image === imageSearch);
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
        throw InternalServerError(e);
    }
};
