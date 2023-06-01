import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import React from "react";
import ProjectSettings from "@/components/project/settings/project-settings-tab";

export default async function ProjectSettingsPage({
    params,
    searchParams,
}: {
    params: { project: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const session = await getServerSession(authOptions);
    const projectId: string = params?.project;

    return <ProjectSettings session={session} projectId={projectId} />;
}
