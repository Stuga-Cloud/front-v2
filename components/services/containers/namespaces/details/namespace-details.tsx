"use client";
import { Session } from "next-auth";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Project } from "@/lib/models/project";
import { toastEventEmitter } from "@/lib/event-emitter/toast-event-emitter";

export default function NamespaceDetails({
    session,
    projectId,
    namespaceId,
}: {
    session: Session | null;
    projectId: string;
    namespaceId: string;
}) {
    const user = session?.user;
    const router = useRouter();
    const [project, setProject] = useState<Project | null>(null);
    const [namespace, setNamespace] = useState<null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const getProject = async (projectId: string) => {
        try {
            const res = await fetch(`/api/projects/${projectId}`);
            return await res.json();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (!projectId) return;
        setLoading(true);
        getProject(projectId)
            .then((foundProject) => {
                setProject(foundProject);
                setLoading(false);
            })
            .catch((error) => {
                toastEventEmitter.emit("pop", {
                    type: "danger",
                    message:
                        "error when try to get project in containers list page",
                    duration: 2000,
                });
                console.error(
                    "error when try to get project in containers list page",
                    error,
                );
                setLoading(false);
            });
    }, [projectId]);

    return (
        <>
            <div className="z-10 flex w-full flex-col items-center justify-center p-4">
                <h1 className="text-3xl font-semibold">Namespace Details</h1>
                Namespace details : {namespaceId}
            </div>
        </>
    );
}
