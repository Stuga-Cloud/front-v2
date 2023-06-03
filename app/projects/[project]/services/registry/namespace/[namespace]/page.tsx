import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import NamespaceDetail from "@/components/services/registry/detail/namespace-detail";
import { getServerSession } from "next-auth";

export default async function NamespaceDetailPage({
    params,
    searchParams,
  }: {
    params: { namespace: string, project: string };
    searchParams?: { [key: string]: string | string[] | undefined };
  }) {

    const namespaceId = params.namespace;
    const projectId = params.project;
    const session = await getServerSession(authOptions);
    if (!session) return (<div>Not Authentified</div>);
    
    return (
        <NamespaceDetail session={session} namespaceId={namespaceId} projectId={projectId} />
    );
}