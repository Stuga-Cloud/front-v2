import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Namespaces from "@/components/services/registry/namespaces-table";
import { getServerSession } from "next-auth";

export default async function NamespacesPage({
    params,
    searchParams,
  }: {
    params: { project: string };
    searchParams?: { [key: string]: string | string[] | undefined };
  }) {
    const project = params.project;
    const session = await getServerSession(authOptions);
    if (!session) return (<div>Not Authentified</div>);
    
    return (
        <Namespaces session={session} projectId={project} />
    );
}
