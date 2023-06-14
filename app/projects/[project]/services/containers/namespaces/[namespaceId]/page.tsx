import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { BreadcrumbItem } from "@/components/shared/breadcrumb";
import { Suspense } from "react";
import Nav from "@/components/layout/nav";
import UnAuthentified from "@/components/home/un-authentified";
import NamespaceDetails from "@/components/services/containers/namespaces/details/namespace-details";

export default async function NamespaceDetailsPage({
    params,
}: {
    params: { project: string; namespaceId: string };
}) {
    const session = await getServerSession(authOptions);
    const projectId = params.project;
    const namespaceId = params.namespaceId;

    const breadcrumbItems: BreadcrumbItem[] = [
        { text: "project", slug: `/projects/${projectId}` },
        {
            text: "containers",
            slug: `/projects/${projectId}/services/containers/`,
        },
        {
            text: "namespace",
            slug: `/projects/${projectId}/services/containers/namespaces/${namespaceId}`,
        },
    ];

    return (
        <>
            <Suspense fallback="...">
                <Nav session={session} breadcrumbItems={breadcrumbItems} />
            </Suspense>
            {session ? (
                <>
                    <div className="z-10 flex flex w-full flex-col">
                        <NamespaceDetails
                            session={session}
                            projectId={projectId}
                            namespaceId={namespaceId}
                        />
                    </div>
                </>
            ) : (
                <>
                    <UnAuthentified />
                </>
            )}
        </>
    );
}
