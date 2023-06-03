import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { isConnected } from "@/lib/utils";
import ResponseService from "@/lib/next-response";
import type { ProjectParam } from "types/param";

export async function POST(req: NextRequest, { params }: ProjectParam) {
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

export async function GET(_req: NextRequest, { params }: ProjectParam) {
    const session = await getServerSession(authOptions);
    console.log("session front", session);

    if (!isConnected(session)) {
        return ResponseService.unauthorized();
    }
    try {
        // const databases = await prisma.database.findMany({
        //     where: { projectId: params.project },
        // });

        const databases = [
          {id: "uuuehofhowefibefobwo", projectId: "clie9ta990007atvfiuhvqpwu", name: "db-1" },
          {id: "xugghfhowefiobowwoth", projectId: "clie9ta990007atvfiuhvqpwu", name: "db-2" },
        ];
        console.log("databases:", databases);
        return ResponseService.success(databases);
    } catch (error) {
        console.error("Error fetching databases:", error);
        return ResponseService.internalServerError();
    }
}
