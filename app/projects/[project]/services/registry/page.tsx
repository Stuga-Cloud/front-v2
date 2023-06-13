import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Nav from "@/components/layout/nav";
import Namespaces from "@/components/services/registry/all/namespaces-table";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function NamespacesPage({
    params,
    searchParams,
}: {
    params: { project: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const project = params.project;
    const session = await getServerSession(authOptions);
    if (!session) redirect("/");

    const breadcrumbItem: BreadcrumbItem[] = [
        { text: "project", slug: `/projects/${project}` },
        {
            text: "registry",
            slug: `/projects/${project}/services/registry/`,
        },
    ];

    return (
        <>
            <Suspense fallback="...">
                <Nav
                    session={session}
                    breadcrumbItems={[
                        { text: "project", slug: `project/${params.project}` },
                    ]}
                />
            </Suspense>
            <div className="z-10 flex w-full flex-col items-center justify-center">
                <Namespaces session={session} projectId={project} />
            </div>
        </>
    );
}
