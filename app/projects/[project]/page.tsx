import { getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import Project from "@/components/project/project";
import type { ProjectParam } from "types/param";
import { Breadcrumb } from "@/components/shared/breadcrumb";

export default async function ProjectPage({ params }: ProjectParam) {
    const session = await getServerSession(authOptions);

    const projectId = params.project;
    return (
        <>
            <Breadcrumb items={[{text: "Project", slug: `project/${params.project}` }]} />
            {session ? (
                <Project session={session} projectId={projectId} />
            ) : (
                console.log("not authentified")
            )}
        </>
    );
}
