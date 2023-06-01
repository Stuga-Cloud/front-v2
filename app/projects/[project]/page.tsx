import { getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import Project from "@/components/project/project";


export default async function ProjectPage({
    params,
    searchParams,
  }: {
    params: { project: string };
    searchParams?: { [key: string]: string | string[] | undefined };
  }) {
    const session = await getServerSession(authOptions);


    const projectId = params.project;
    
    return (
        <>
            {session ? (
                <Project session={session} projectId={projectId} />
            ) : (
                console.log("not authentified")
            )}
        </>
    );
}
