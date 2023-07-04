import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import RegistryForm from "@/components/services/registry/create/registry-form";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Nav from "@/components/layout/nav";
import { BreadcrumbItem } from "@/components/shared/breadcrumb";
import UnAuthentified from "@/components/home/un-authentified";

export default async function RegistryNewPage({
    params,
    searchParams,
}: {
    params: { project: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/");
    const projectId = params.project;
    const breadcrumbItem: BreadcrumbItem[] = [
        { text: "project", slug: `/projects/${projectId}` },
        {
            text: "registry",
            slug: `/projects/${projectId}/services/registry/`,
        },
        {
            text: "new",
            slug: `/projects/${projectId}/services/registry/new`,
        },
    ];

    return (
        <>
            <Suspense fallback="...">
                <Nav session={session} breadcrumbItems={breadcrumbItem} />
            </Suspense>
            {session ? (
                <RegistryForm session={session} projectId={projectId} />
            ) : (
                <UnAuthentified />
            )}
        </>
    );
}
