import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import NewContainerForm from "@/components/services/containers/create/new-container-form";
import { Breadcrumb, BreadcrumbItem } from "@/components/shared/breadcrumb";

export default async function ContainerNewPage({
    params,
}: {
    params: { project: string };
}) {
    const session = await getServerSession(authOptions);
    const projectId = params.project;

    const breadcrumbItem: BreadcrumbItem[] = [
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
            <div className="z-10 mt-5 flex flex w-full flex-col">
                <Breadcrumb items={breadcrumbItem} />
                <NewContainerForm session={session} projectId={projectId} />
            </div>
        </>
    );
}
