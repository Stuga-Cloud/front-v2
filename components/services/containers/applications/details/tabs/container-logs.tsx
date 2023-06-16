"use client";
import { Session } from "next-auth";
import { redirect, useRouter } from "next/navigation";
import React, { useState } from "react";
import { Project } from "@/lib/models/project";
import { ContainerApplicationNamespace } from "@/lib/models/containers/container-application-namespace";
import { LoadingSpinner } from "@/components/shared/icons";
import { ContainerRetrieved } from "@/components/services/containers/applications/details/container-details";

export default function ContainerLogs({
    session,
    project,
    container,
    namespace,
    reloadContainer,
}: {
    session: Session;
    project: Project;
    container: ContainerRetrieved;
    namespace: ContainerApplicationNamespace;
    reloadContainer: () => void;
}) {
    if (!session) redirect("/");
    if (!project || !container)
        redirect(`/projects/${project.id}/services/containers`);

    const router = useRouter();
    const [loading, setLoading] = useState(false);

    return (
        <>
            {loading && <LoadingSpinner />}
            <div className="z-10 flex w-full flex-col items-center justify-center">
                <div className="mb-2 flex w-4/5 flex-row items-center justify-between">
                    LOGS
                </div>
            </div>
        </>
    );
}
