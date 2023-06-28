import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { StugaError } from "@/lib/services/error/error";
import { VerifyIfUserCanAccessProject } from "@/lib/services/project/verify-user-access";
import { AddUserInNamespace } from "@/lib/services/registry/harbor/add-user-in-namespace";
import { GetUser } from "@/lib/services/registry/harbor/user/get-user";
import { GetNamespaceById } from "@/lib/services/registry/namespace/get-namespace-by-id";

export interface RequestBody {
    password: string;
}
// @ts-ignore
export async function POST(request: Request, { params }: NextRequest) {
    const session = await getServerSession(authOptions);
    const email = session!.user!.email;

    const projectId = params!.project;
    const namespaceId = params!.namespaceId;
    const projectGetOrNextResponse = await VerifyIfUserCanAccessProject(
        projectId,
        session,
    );

    if (projectGetOrNextResponse instanceof StugaError) {
        return projectGetOrNextResponse;
    }

    try {
        const user = await GetUser(email!);

        if (!user) {
            return NextResponse.json(
                {
                    error: "user not found",
                },
                { status: 404 },
            );
        }
        const namespace = await GetNamespaceById(namespaceId);

        await AddUserInNamespace(user.user_id, namespace);
        return NextResponse.json(
            {
                message: "user added in namespace",
            },
            { status: 201 },
        );
    } catch (e) {
        if (e instanceof StugaError) {
            return NextResponse.json(
                {
                    error: e.message,
                },
                { status: e.status },
            );
        }

        return NextResponse.json(
            {
                error: "error adding user in namespace",
            },
            { status: 500 },
        );
    }
}
