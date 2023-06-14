import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { isConnected } from "@/lib/utils";
import ResponseService from "@/lib/next-response";
import { CreateContainerApplication } from "@/lib/services/containers/create-container-application";
import { CreateContainerApplicationBody } from "@/lib/services/containers/create-container-application.body";
import { PrismaClientKnownRequestError } from "prisma/prisma-client/runtime";

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
        port,
        containerSpecifications,
        scalabilitySpecifications,
        applicationType,
        environmentVariables,
        secrets,
        administratorEmail,
    }: CreateContainerApplicationBody = await req.json();

    try {
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
        console.log("new application:", application);

        const newContainer = await prisma.container.create({
            data: {
                name,
                namespaceId: namespaceId,
                idInAPI: application.id,
            },
        });
        console.log("new container:", newContainer);

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

// TODO , not used yet I think
export async function GET(
    _req: NextRequest,
    { params }: { params: { project: string; namespaceId: string } },
) {
    const session = await getServerSession(authOptions);

    if (!isConnected(session)) {
        return ResponseService.unauthorized();
    }
    try {
        const namespaceId = params.namespaceId;
        const containers = await prisma.container.findMany({
            where: {
                namespaceId: namespaceId,
            },
        });

        console.log("containers:", containers);
        return ResponseService.success(containers);
    } catch (error) {
        console.error("Error fetching databases:", error);
        return ResponseService.internalServerError();
    }
}
