import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ResponseService from "@/lib/next-response";
import { StugaError } from "@/lib/services/error/error";
import { StugaErrorToNextResponse } from "@/lib/services/error/stuga-error-to-next-response";
import { DeleteImageInNamespace } from "@/lib/services/harbor/delete-image-in-namespace";
import { DeleteNamespace } from "@/lib/services/harbor/delete-namespace";
import { GetNamespaceImages } from "@/lib/services/harbor/get-namespace-images";
import { GetNamespaceById } from "@/lib/services/namespace/get-namespace-by-id";
import { VerifyIfNamespaceIsInProject } from "@/lib/services/namespace/verify-if-namespace-is-in-project";
import { VerifyIfUserCanAccessProject } from "@/lib/services/project/verify-user-access";
import { getServerSession } from "next-auth/next";
import { NextRequest } from "next/server";

export async function DELETE(request: Request, { params }: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        const projectId = params!.project;
        const namespaceId = params!.namespaceId;
        const projectGetOrNextResponse = await VerifyIfUserCanAccessProject(
            projectId,
            session,
        );

        if (projectGetOrNextResponse instanceof StugaError) {
            return projectGetOrNextResponse;
        }

        const namespace = await GetNamespaceById(namespaceId);
        const namespaceIsInProject = await VerifyIfNamespaceIsInProject({
            project: projectGetOrNextResponse,
            namespace,
        });
        if (namespaceIsInProject !== true) {
            throw ResponseService.unauthorized(
                "namespace-not-found-in-project",
            );
        }

        const imagesInNamespace = await GetNamespaceImages(namespace.name);

        await Promise.all(
            imagesInNamespace.map(async (image) => {
                await DeleteImageInNamespace({
                    namespaceName: namespace.name,
                    imageName: image.name,
                });
            }),
        );

        await DeleteNamespace(namespace.name);
    } catch (error) {
        if (error instanceof StugaError) {
            return StugaErrorToNextResponse(error);
        }
        return ResponseService.internalServerError("internal-server-error");
    }
}
