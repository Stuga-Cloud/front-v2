import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { InternalServerError, StugaError } from "@/lib/services/error/error";
import { CreateUser } from "@/lib/services/registry/harbor/user/create-user";
import { GetUser } from "@/lib/services/registry/harbor/user/get-user";
import { VerifyIfUserCanAccessProject } from "@/lib/services/project/verify-user-access";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export interface RequestParams {
    project: string;
}

export async function GET(request: Request, { params }: NextRequest) {
    const session = await getServerSession(authOptions);
    const email = session!.user!.email;

    const projectId = params!.project;
    try {
        const projectGetOrNextResponse = await VerifyIfUserCanAccessProject(
            projectId,
            session,
        );

        if (projectGetOrNextResponse instanceof StugaError) {
            return NextResponse.json(
                {
                    error: projectGetOrNextResponse.message,
                },
                { status: projectGetOrNextResponse.status },
            );
        }

        const user = await GetUser(email!);
        if (!user) {
            return NextResponse.json(
                {
                    error: `User ${email} does not exist`,
                },
                { status: 404 },
            );
        }
        return NextResponse.json(user, { status: 200 });
    } catch (e) {
        console.log(e);
        if (e instanceof StugaError) {
            console.log(e);
            return NextResponse.json(
                {
                    error: e.message,
                },
                { status: e.status },
            );
        }
        return InternalServerError;
    }
}

export async function POST(request: Request, { params }: NextRequest) {
    const session = await getServerSession(authOptions);
    const email = session!.user!.email;
    const req = await request.json();
    const password = req.password;
    const projectId = params!.project;
    try {
        const projectGetOrNextResponse = await VerifyIfUserCanAccessProject(
            projectId,
            session,
        );

        if (projectGetOrNextResponse instanceof StugaError) {
            return NextResponse.json(
                {
                    error: projectGetOrNextResponse.message,
                },
                { status: projectGetOrNextResponse.status },
            );
        }

        const user = await CreateUser(email!, password);
        return NextResponse.json(user, { status: 201 });
    } catch (e) {
        if (e instanceof StugaError) {
            return NextResponse.json(
                {
                    error: e.message,
                },
                { status: e.status },
            );
        }
        return InternalServerError;
    }
}
