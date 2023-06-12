import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import LambdaAccueil from "@/components/services/lambdas/all/lambdas-accueil";
import { Breadcrumb, BreadcrumbItem } from "@/components/shared/breadcrumb";
import { getServerSession } from "next-auth";

export default async function LambdaPage({
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
            slug: `/projects/${projectId}/services/lambdas/`,
        },
    ];

    if (session === null) return;

    return (
        <>
            <div className="z-10 mt-5 flex flex w-full flex-col">
                <Breadcrumb items={breadcrumbItem} />
                <LambdaAccueil session={session} projectId={projectId} />
            </div>
        </>
    );
}
