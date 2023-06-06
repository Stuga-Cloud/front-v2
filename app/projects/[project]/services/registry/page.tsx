import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Namespaces from "@/components/services/registry/all/namespaces-table";
import { Breadcrumb, BreadcrumbItem } from "@/components/shared/breadcrumb";
import { getServerSession } from "next-auth";
import { redirect } from 'next/navigation';

export default async function NamespacesPage({
    params,
    searchParams,
}: {
    params: { project: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const project = params.project;
    const session = await getServerSession(authOptions);
    if (!session) redirect('/');

    const breadcrumbItem: BreadcrumbItem[] = [
        { text: "project", slug: `/projects/${project}` },
        {
            text: "registry",
            slug: `/projects/${project}/services/registry/`,
        },
    ];

    return (
        <div className="z-10 flex w-full flex-col items-center justify-center">
            {/* <div className="mb-20 w-4/5">
                <Breadcrumb items={breadcrumbItem} />
            </div> */}
            <Namespaces session={session} projectId={project} />
        </div>
    );
}
