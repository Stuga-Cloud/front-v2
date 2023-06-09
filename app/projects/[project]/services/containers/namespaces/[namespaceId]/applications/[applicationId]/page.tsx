import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { BreadcrumbItem } from "@/components/shared/breadcrumb";
import ContainerDetails from "@/components/services/containers/applications/details/container-details";
import { Suspense } from "react";
import Nav from "@/components/layout/nav";
import UnAuthentified from "@/components/home/un-authentified";

export default async function ContainerDetailsPage({
    params,
}: {
    params: { project: string; applicationId: string; namespaceId: string };
}) {
    const session = await getServerSession(authOptions);
    const projectId = params.project;
    const applicationId = params.applicationId;
    const namespaceId = params.namespaceId;

    const breadcrumbItems: BreadcrumbItem[] = [
        { text: "...", slug: `/projects/${projectId}/services/containers` },
        {
            text: "namespace",
            slug: `/projects/${projectId}/services/containers/namespaces/${namespaceId}`,
        },
        {
            text: "application",
            slug: `/projects/${projectId}/services/containers/namespaces/${namespaceId}/applications/${applicationId}`,
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
                        <ContainerDetails
                            session={session}
                            projectId={projectId}
                            containerId={applicationId}
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
