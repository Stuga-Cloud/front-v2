import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import NewLambdaForm from "@/components/services/lambdas/create/lambda-form";
import { Breadcrumb, BreadcrumbItem } from "@/components/shared/breadcrumb";
import { getServerSession } from "next-auth";
import { Suspense } from "react";
import Nav from "@/components/layout/nav";

export default async function LambdaNewPage({
    params,
    searchParams,
}: {
    params: { project: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const session = await getServerSession(authOptions);
    const projectId = params.project;

    const breadcrumbItem: BreadcrumbItem[] = [
        { text: "project", slug: `/projects/${projectId}` },
        {
            text: "lambdas",
            slug: `/projects/${projectId}/services/lambdas`,
        },
        {
            text: "new",
            slug: `/projects/${projectId}/services/lambdas/new`,
        },
    ];

    return (
        <>
            <Suspense fallback="...">
                <Nav session={session} breadcrumbItems={breadcrumbItem} />
            </Suspense>
            <div className="z-10 mt-5 flex flex w-full flex-col">
                <Breadcrumb items={breadcrumbItem} />
                <NewLambdaForm session={session} projectId={projectId} />
            </div>
        </>
    );
}
