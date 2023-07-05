import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { isConnected } from "@/lib/utils";
import ResponseService from "@/lib/next-response";
import { CreateContainerApplication } from "@/lib/services/containers/create-container-application";
import { CreateContainerApplicationBody } from "@/lib/services/containers/create-container-application.body";
import { PrismaClientKnownRequestError } from "prisma/prisma-client/runtime";
import { verifyIfImageExists } from "@/lib/services/lambdas/verify-if-image-exists";
import { AxiosError } from "axios";

export async function POST(
    req: NextRequest,
    { params }: { params: { project: string; namespaceId: string } },
) {
    const session = await getServerSession(authOptions);

    if (!isConnected(session)) {
        return ResponseService.unauthorized();
    }

    const user = await prisma.user.findUnique({
        where: { email: session!.user!.email! },
    });

    if (!user) {
        return ResponseService.unauthorized();
    }

    const projectId = params!.project;
    const project = await prisma.project.findUnique({
        where: { id: projectId },
    });

    if (!project) {
        return ResponseService.notFound();
    }

    const {
        name,
        description,
        image,
        registry,
        port,
        containerSpecifications,
        scalabilitySpecifications,
        applicationType,
        environmentVariables,
        secrets,
        administratorEmail,
    }: CreateContainerApplicationBody = await req.json();

    try {
        if (image) {
            const repository = image.split("/")[0];
            // const parts = image.split("/");
            // const imageName = parts.slice(1).join("/");
            var imageToCheck = image;
            if (registry === "pcr") {
                imageToCheck = image.split(":")[0];
            }
            if (registry === "dockerhub") {
                imageToCheck = image.split("/")[1];
            }
            const verifyIfImageExistsResponse = await verifyIfImageExists(
                imageToCheck,
                projectId,
                registry,
                repository,
            );
            if (verifyIfImageExistsResponse instanceof NextResponse) {
                return ResponseService.notFound("Image not found in registry", {
                    error: "image_not_found_in_registry",
                    fullError: verifyIfImageExistsResponse,
                    applicationImage: image,
                    applicationName: name,
                });
            }
        }

        const namespaceId = params.namespaceId;
        const namespace = await prisma.containerNamespace.findUnique({
            where: { id: namespaceId },
        });
        if (!namespace) {
            return ResponseService.notFound(
                `Namespace ${namespaceId} not found`,
            );
        }

        const application = await CreateContainerApplication({
            name: name,
            namespaceId: namespace.idInAPI,
            description: description,
            image: image,
            registry: registry,
            port: port,
            zone: "europe-west-1",
            containerSpecifications,
            scalabilitySpecifications,
            applicationType,
            environmentVariables,
            secrets,
            userId: user.id,
            administratorEmail: administratorEmail,
        });
        if (!application) {
            console.log("Error creating application :", application);
            return ResponseService.internalServerError();
        }

        const newContainer = await prisma.container.create({
            data: {
                name,
                namespaceId: namespaceId,
                idInAPI: application.id,
            },
        });

        return ResponseService.created(newContainer);
    } catch (error) {
        console.error("Error creating container:", error);
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                return ResponseService.conflict();
            }
        }
        if (error instanceof AxiosError) {
            console.log('error.response', error.response);
            if (error.response?.status === 404) {
                return ResponseService.notFound(
                    "Namespace not found in container provider",
                );
            }
            if (error.response?.status === 403) {
                return ResponseService.unauthorized(
                    "You are not authorized to access this namespace",
                );
            }
            
            if (error.response?.data?.error.includes("already exists")) {
                return ResponseService.conflict(
                    "Application already exists in container provider",
                );
            }
        }
        return ResponseService.internalServerError();
    }
}
