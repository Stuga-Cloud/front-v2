import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import RegistryForm from "@/components/services/registry/create/registry-form";

export default async function RegistryNewPage({
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
            <RegistryForm session={session} projectId={projectId} />
        </>
    );
}
