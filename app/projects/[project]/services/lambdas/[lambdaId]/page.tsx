import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Nav from "@/components/layout/nav";
import LambdaDetail from "@/components/services/lambdas/detail/lambda-detail";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function LambdaDetailPage({
    params,
    searchParams,
}: {
    params: { lambdaId: string; project: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const lambdaId = params.lambdaId;
    const projectId = params.project;
    const session = await getServerSession(authOptions);

    if (!session) redirect("/");

    return (
        <>
            <Suspense fallback="...">
                <Nav
                    session={session}
                    breadcrumbItems={[
                        { text: "project", slug: `project/${params.project}` },
                        {
                            text: "lambdas",
                            slug: `project/${params.project}/services/lambdas`,
                        },
                    ]}
                />
            </Suspense>
            <LambdaDetail
                session={session}
                lambdaId={lambdaId}
                projectId={projectId}
            />
        </>
    );
}
