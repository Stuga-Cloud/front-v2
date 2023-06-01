import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import RegistryForm from "@/components/services/registry/registry-form";
import { getServerSession } from "next-auth/next";

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
