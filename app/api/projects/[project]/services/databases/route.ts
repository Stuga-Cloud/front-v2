import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { isConnected } from "@/lib/utils";
import ResponseService from "@/lib/next-response";

export async function POST(req: NextRequest, { params }: { params: { project: string } }) {
    const session = await getServerSession(authOptions);
    console.log('session back', session)

    if (!isConnected(session)) {
        return ResponseService.unauthorized();
    }

    const { name } = await req.json();

    try {
        const newDatabase = await prisma.database.create({
            data: {
                name,
                projectId: params.project,
            },
        });


        console.log("new database:", newDatabase);
        return ResponseService.created(newDatabase);
    } catch (error) {
        console.error("Error creating database:", error);
        return ResponseService.internalServerError();
    }
}

export async function GET(_req: NextRequest, { params }: { params: { project: string } }) {
    const session = await getServerSession(authOptions);
    console.log(session)

    if (!isConnected(session)) {
        return ResponseService.unauthorized();
    }
    try {
        const databases = await prisma.database.findMany({
            where: { projectId: params.project },
        });

        console.log("databases:", databases);
        return ResponseService.success(databases);
    } catch (error) {
        console.error("Error fetching databases:", error);
        return ResponseService.internalServerError();
    }
}
