import React from "react";
import ProjectSettings from "@/components/project/settings/project-settings-tab";

export default async function ProjectSettingsPage({
    params,
}: {
    params: { project: string };
}) {
    const projectId: string = params?.project;

    return <ProjectSettings projectId={projectId} />;
}
