import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Breadcrumb, BreadcrumbItem } from "@/components/shared/breadcrumb";
import ContainerDetails from "@/components/services/containers/container-details";
import { Suspense } from "react";
import Nav from "@/components/layout/nav";

export default async function ContainerDetailsPage({
    params,
}: {
    params: { project: string; applicationId: string };
}) {
    const session = await getServerSession(authOptions);
    const projectId = params.project;
    const applicationId = params.applicationId;

    const breadcrumbItems: BreadcrumbItem[] = [
        { text: "project", slug: `/projects/${projectId}` },
        {
            text: "containers",
            slug: `/projects/${projectId}/services/containers/`,
        },
        {
            text: "details",
            slug: `/projects/${projectId}/services/containers/${applicationId}`,
        },
    ];

    return (
        <>
          <Suspense fallback="...">
            <Nav session={session} breadcrumbItems={breadcrumbItems} />
          </Suspense>
            <div className="z-10 flex flex w-full flex-col">
                <ContainerDetails
                    session={session}
                    projectId={projectId}
                    containerId={applicationId}
                />
            </div>
        </>
    );
}
