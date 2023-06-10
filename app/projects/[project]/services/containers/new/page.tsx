import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import NewContainerForm from "@/components/services/containers/create/new-container-form";
import { Breadcrumb, BreadcrumbItem } from "@/components/shared/breadcrumb";
import { Suspense } from "react";
import Nav from "@/components/layout/nav";

export default async function ContainerNewPage({
    params,
}: {
    params: { project: string };
}) {
    const session = await getServerSession(authOptions);
    const projectId = params.project;

    const breadcrumbItems: BreadcrumbItem[] = [
        { text: "project", slug: `/projects/${projectId}` },
        {
            text: "containers",
            slug: `/projects/${projectId}/services/containers/`,
        },
        {
            text: "new",
            slug: `/projects/${projectId}/services/containers/new`,
        },
    ];

    return (
        <>
          <Suspense fallback="...">
            <Nav session={session} breadcrumbItems={breadcrumbItems} />
          </Suspense>
            <div className="z-10 mt-5 flex flex w-full flex-col">
                <NewContainerForm session={session} projectId={projectId} />
            </div>
        </>
    );
}
