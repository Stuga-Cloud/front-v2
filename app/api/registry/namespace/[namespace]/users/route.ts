import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import axios, { Axios, AxiosError } from "axios";
import { GetUserInNamespace } from "@/lib/services/registry/harbor/get-user-in-namespace";
import { GetUser } from "@/lib/services/registry/harbor/user/get-user";

export interface GetMemberResponse {
    entity_id: number;
    entity_name: string;
    entity_type: string;
    id: number;
    project_id: number;
    role_id: number;
    role_name: string;
}

// @ts-ignore
export async function GET(request: Request, { params }: NextRequest) {
    const session = await getServerSession(authOptions);
    const namespaceId = params!.namespace;

    if (!session) {
        return NextResponse.json(
            {
                error: "You have to be connected to get a namespace.",
            },
            { status: 401 },
        );
    }

    const namespace = await prisma.registryNamespace.findFirst({
        where: {
            id: namespaceId,
        },
    });

    if (!namespace) {
        return NextResponse.json(
            {
                error: "namespace not found",
            },
            { status: 404 },
        );
    }

    try {
        const user = await GetUser(session.user?.email!);
        
        if (!user) {
            return NextResponse.json(
                {
                    error: "user-not-found",
                },
                { status: 404 },
            );
        }

        const member = await GetUserInNamespace(namespace.name, user.user_id);

        if (!member) {
            return NextResponse.json(
                {
                    error: "user-not-in-namespace",
                },
                { status: 403 },
            );
        }
        return NextResponse.json(
            {
                userId: user.user_id,
                username: user.username,
            },
            { status: 200 },
        );

    } catch (e) {
        return NextResponse.json(
            {
                error: "An error occured",
            },
            { status: 500 },
        );
    }

}
