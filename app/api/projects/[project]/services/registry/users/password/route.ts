import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { InternalServerError, StugaError } from "@/lib/services/error/error";
import { GetUser } from "@/lib/services/registry/harbor/user/get-user";
import { ModifyUserPassword } from "@/lib/services/registry/harbor/user/modify-password";
import { VerifyIfUserCanAccessProject } from "@/lib/services/project/verify-user-access";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
// @ts-ignore
export async function PATCH(request: Request, { params }: NextRequest) {
    const session = await getServerSession(authOptions);
    const email = session!.user!.email;
    const req = await request.json();
    const password = req.password;
    const oldPassword = req.oldPassword;
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

        const userModify = await ModifyUserPassword(
            oldPassword,
            password,
            user,
        );
        return NextResponse.json(userModify, { status: 200 });
    } catch (e) {
        if (e instanceof StugaError) {
            return NextResponse.json(
                {
                    error: e.message,
                },
                { status: e.status },
            );
        }
        return InternalServerError(e);
    }
}
