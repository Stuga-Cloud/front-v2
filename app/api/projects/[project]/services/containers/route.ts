import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { isConnected } from "@/lib/utils";
import ResponseService from "@/lib/next-response";
import { UpsertContainerNamespace } from "@/lib/services/containers/namespaces/create-container-namespace";
import { CreateContainerApplication } from "@/lib/services/containers/create-container-application";
import { CreateContainerApplicationBody } from "@/lib/services/containers/create-container-application.body";
import { PrismaClientKnownRequestError } from "prisma/prisma-client/runtime";

export async function POST(
    req: NextRequest,
    { params }: { params: { project: string } },
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
        image,
        port,
        containerSpecifications,
        scalabilitySpecifications,
        applicationType,
        environmentVariables,
        secrets,
        administratorEmail,
    }: CreateContainerApplicationBody = await req.json();

    try {
        const newContainer = await prisma.container.create({
            data: {
                name,
                projectId: params.project,
            },
        });
        console.log("new container:", newContainer);

        // TODO CHANGE THIS TO USE EXISTING NAMESPACE
        const namespace = await UpsertContainerNamespace(
            project.name,
            "",
            user.id,
        );
        if (!namespace) {
            console.log("Error creating namespace :", namespace);
            return ResponseService.internalServerError();
        }
        console.log("new namespace:", namespace);

        const application = await CreateContainerApplication({
            name: name,
            namespaceId: namespace.id,
            description: "",
            image: image,
            port: port,
            zone: "europe-west1-b",
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
        console.log("new application:", application);
        return ResponseService.created(newContainer);
    } catch (error) {
        console.error("Error creating container:", error);
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                return ResponseService.conflict();
            }
        }
        return ResponseService.internalServerError();
    }
}

export async function GET(
    _req: NextRequest,
    { params }: { params: { project: string } },
) {
    const session = await getServerSession(authOptions);

    if (!isConnected(session)) {
        return ResponseService.unauthorized();
    }
    try {
        const containers = await prisma.container.findMany({
            where: { projectId: params.project },
        });

        console.log("containers:", containers);
        return ResponseService.success(containers);
    } catch (error) {
        console.error("Error fetching databases:", error);
        return ResponseService.internalServerError();
    }
}
