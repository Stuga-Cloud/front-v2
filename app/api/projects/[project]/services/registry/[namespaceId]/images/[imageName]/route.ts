import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ResponseService from "@/lib/next-response";
import { StugaError } from "@/lib/services/error/error";
import { StugaErrorToNextResponse } from "@/lib/services/error/stuga-error-to-next-response";
import { VerifyIfUserCanAccessProject } from "@/lib/services/project/verify-user-access";
import { getServerSession } from "next-auth";
import { DeleteImageInNamespace } from "@/lib/services/registry/harbor/delete-image-in-namespace";
import { NextRequest } from "next/server";
import { GetNamespaceById } from "@/lib/services/registry/namespace/get-namespace-by-id";
import { VerifyIfNamespaceIsInProject } from "@/lib/services/registry/namespace/verify-if-namespace-is-in-project";

// @ts-ignore
export async function DELETE(request: Request, { params }: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        const projectId = params!.project;
        const namespaceId = params!.namespaceId;
        const imageName = params!.imageName;
        const projectGetOrNextResponse = await VerifyIfUserCanAccessProject(
            projectId,
            session,
        );

        if (projectGetOrNextResponse instanceof StugaError) {
            return StugaErrorToNextResponse(projectGetOrNextResponse);
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

        await DeleteImageInNamespace({
            namespaceName: namespace.name,
            imageName: imageName,
        });

        return ResponseService.success({
            message: "image-deleted",
        });
    } catch (error) {
        if (error instanceof StugaError) {
            return StugaErrorToNextResponse(error);
        }
        return ResponseService.internalServerError(
            "internal-server-error",
            error,
        );
    }
}
