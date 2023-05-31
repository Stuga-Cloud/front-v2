import { getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import Project from "@/components/project/project";
import UnAuthentified from "@/components/home/un-authentified";
import { useRouter } from "next/navigation";

export default async function ProjectPage({
    searchParams,
}: {
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const session = await getServerSession(authOptions);

    const projectId = searchParams?.project;
    const project = await fetch(`/api/projects/${projectId}`)
        .then((response) => response.json())
        .catch(() => console.log("error"));
    console.log(project);

    return (
        <>
            {session ? (
                <Project session={session} project={project} />
            ) : (
                console.log("not authentified")
            )}
        </>
    );
}
