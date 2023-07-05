import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import UnAuthentified from "@/components/home/un-authentified";
import Nav from "@/components/layout/nav";
import NamespaceDetail from "@/components/services/registry/detail/namespace-detail";
import { BreadcrumbItem } from "@/components/shared/breadcrumb";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function NamespaceDetailPage({
    params,
    searchParams,
}: {
    params: { namespace: string; project: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const namespaceId = params.namespace;
    const projectId = params.project;
    const session = await getServerSession(authOptions);
    const breadcrumbItem: BreadcrumbItem[] = [
        { text: "project", slug: `/projects/${projectId}` },
        {
            text: "registry",
            slug: `/projects/${projectId}/services/registry/`,
        },
        {
            text: "namespace",
            slug: `/projects/${projectId}/services/registry/namespace/${namespaceId}`,
        },
    ];

    return (
        <>
            <Suspense fallback="...">
                <Nav session={session} breadcrumbItems={breadcrumbItem} />
            </Suspense>
            {session ? (
                <NamespaceDetail
                    session={session}
                    namespaceId={namespaceId}
                    projectId={projectId}
                />
            ) : (
                <UnAuthentified />
            )}
        </>
    );
}
