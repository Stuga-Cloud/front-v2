import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import UnAuthentified from "@/components/home/un-authentified";
import Nav from "@/components/layout/nav";
import LambdaAccueil from "@/components/services/lambdas/all/lambdas-accueil";
import { Breadcrumb, BreadcrumbItem } from "@/components/shared/breadcrumb";
import { getServerSession } from "next-auth";
import { Suspense } from "react";

export default async function LambdaPage({
    params,
    searchParams,
}: {
    params: { project: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const session = await getServerSession(authOptions);
    const projectId = params.project;

    const breadcrumbItems: BreadcrumbItem[] = [
        { text: "project", slug: `/projects/${projectId}` },
        {
            text: "lambdas",
            slug: `/projects/${projectId}/services/lambdas/`,
        },
    ];

    if (session === null) return;

    return (
        <>
            <Suspense fallback="...">
                <Nav session={session} breadcrumbItems={breadcrumbItems} />
            </Suspense>
            {session ? (
            <div className="z-10 mt-5 flex flex w-full flex-col">
                <LambdaAccueil session={session} projectId={projectId} />
            </div>
            ) : (
                <UnAuthentified />
            )}
        </>
    );
}
