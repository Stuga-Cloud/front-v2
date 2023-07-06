import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import NewContainerForm from "@/components/services/containers/applications/create/new-container-form";
import { BreadcrumbItem } from "@/components/shared/breadcrumb";
import { Suspense } from "react";
import Nav from "@/components/layout/nav";
import UnAuthentified from "@/components/home/un-authentified";

export default async function ContainerNewPage({
    params,
}: {
    params: { project: string; namespaceId: string };
}) {
    const session = await getServerSession(authOptions);
    const projectId = params.project;
    const namespaceId = params.namespaceId;

    const breadcrumbItems: BreadcrumbItem[] = [
        { text: "...", slug: `/projects/${projectId}/services/containers/` },
        {
            text: "namespace",
            slug: `/projects/${projectId}/services/containers/namespaces/${namespaceId}`,
        },
        {
            text: "new",
            slug: `/projects/${projectId}/services/containers/namespaces/${namespaceId}/applications/new`,
        },
    ];

    return (
        <>
            <Suspense fallback="...">
                <Nav session={session} breadcrumbItems={breadcrumbItems} />
            </Suspense>
            {session ? (
                <>
                    <div className="z-10 mt-5 flex flex w-full flex-col">
                        <NewContainerForm
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
