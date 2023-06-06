import React from "react";
import ProjectSettings from "@/components/project/settings/project-settings-tab";
import type { ProjectParam } from "types/param";

export default async function ProjectSettingsPage({
    params,
}: ProjectParam) {
    const projectId: string = params?.project;

    return <ProjectSettings projectId={projectId} />;
}
