"use client";
import { Session } from "next-auth";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Project } from "@/lib/models/project";
import { ContainerApplicationType } from "@/lib/models/containers/container-application-type";

export default function ContainerDetails({
    session,
    projectId,
    containerId,
}: {
    session: Session | null;
    projectId: string;
    containerId: string;
}) {
    const user = session?.user;
    const router = useRouter();
    const [project, setProject] = useState<Project | null>(null);
    const [container, setContainer] = useState<ContainerApplicationType | null>(
        null,
    );
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    return (
        <>
            <div className="flex w-full flex-col items-center justify-center p-4">
                <h1 className="text-3xl font-semibold">Container Details</h1>
                Container details : {containerId}
            </div>
        </>
    );
}
