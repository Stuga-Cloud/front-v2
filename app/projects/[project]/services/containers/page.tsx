import { BreadcrumbItem } from "@/components/shared/breadcrumb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import UnAuthentified from "@/components/home/un-authentified";
import { Suspense } from "react";
import Nav from "@/components/layout/nav";

export default async function ContainerListPage({
    params,
}: {
    params: { project: string };
}) {
    const session = await getServerSession(authOptions);
    const projectId = params.project;
    const { project } = params;
    const breadcrumbItems: BreadcrumbItem[] = [
        { text: "project", slug: `/projects/${project}` },
        {
            text: "containers",
            slug: `/projects/${project}/services/containers/`,
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
                        <div className="flex flex-col items-center justify-center">
                            <h1>Welcome to the containers page</h1>
                            <p>
                                This page is under construction. Please come
                                back later. Thank you. 🚧
                            </p>
                        </div>
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
