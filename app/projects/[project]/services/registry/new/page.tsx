import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import RegistryForm from "@/components/services/registry/create/registry-form";
import { redirect } from "next/navigation";

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

    return (
        <>
            <RegistryForm session={session} projectId={projectId} />
        </>
    );
}
