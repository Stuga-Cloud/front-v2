import { getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import Project from "@/components/project/project";
import type { ProjectParam } from "types/param";
import { Suspense } from "react";
import Nav from "@/components/layout/nav";

export default async function ProjectPage({ params }: ProjectParam) {
    const session = await getServerSession(authOptions);

    const projectId = params.project;
    return (
        <>
            <Suspense fallback="...">
              <Nav session={session} breadcrumbItems={[{text: "Project", slug: `project/${params.project}` }]} />
            </Suspense>
            {session ? (
                <Project session={session} projectId={projectId} />
            ) : (
                console.log("not authentified")
            )}
        </>
    );
}
