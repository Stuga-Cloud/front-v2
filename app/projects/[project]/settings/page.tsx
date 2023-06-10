import React, { Suspense } from "react";
import ProjectSettings from "@/components/project/settings/project-settings-tab";
import type { ProjectParam } from "types/param";
import Nav from "@/components/layout/nav";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export default async function ProjectSettingsPage({
    params,
}: ProjectParam) {
    const projectId: string = params?.project;
    const session = await getServerSession(authOptions);
    const breadcrumbItems =[
      {text: "Project", slug: `projects/${projectId}` },
      {text: "Settings", slug: `projects/${projectId}/settings` },
    ]; 

    return (
    <>
      <Suspense fallback="...">
        <Nav session={session} breadcrumbItems={breadcrumbItems} />
      </Suspense>
      <ProjectSettings projectId={projectId} />
    </>
  );
}
