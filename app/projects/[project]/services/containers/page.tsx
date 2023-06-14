import { BreadcrumbItem } from "@/components/shared/breadcrumb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Suspense } from "react";
import Nav from "@/components/layout/nav";
import ContainersInfo from "@/components/services/containers/informations/containers-info";
import { redirect } from "next/navigation";
import UnAuthentified from "@/components/home/un-authentified";

export default async function ContainerListPage({
    params,
}: {
    params: { project: string };
}) {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/");

    const projectId = params.project;

    const breadcrumbItems: BreadcrumbItem[] = [
        { text: "project", slug: `/projects/${projectId}` },
        {
            text: "containers",
            slug: `/projects/${projectId}/services/containers/`,
        },
    ];
    return (
        <>
            <Suspense fallback="...">
                <Nav session={session} breadcrumbItems={breadcrumbItems} />
            </Suspense>
            {session ? (
                <>
                    <ContainersInfo session={session} projectId={projectId} />
                </>
            ) : (
                <>
                    <UnAuthentified />
                </>
            )}
        </>
    );
}
