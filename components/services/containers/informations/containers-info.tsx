"use client";
import { Session } from "next-auth";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Project } from "@/lib/models/project";
import { toastEventEmitter } from "@/lib/event-emitter/toast-event-emitter";
import { LoadingSpinner } from "@/components/shared/icons";
import ContainersNamespaces from "@/components/services/containers/informations/containers-namespaces";
import { ContainerNamespace } from "@/lib/models/containers/container-namespace";
import TabsContainersInfo from "@/components/services/containers/informations/tabs-containers-info";

export type AvailableContainersInfoTab = "namespaces";
export default function ContainersInfo({
    session,
    projectId,
}: {
    session: Session;
    projectId: string;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const user = session?.user;
    const [project, setProject] = useState<Project | null>(null);
    const [namespaces, setNamespaces] = useState<ContainerNamespace[]>([]);

    const [activeTab, setActiveTab] =
        useState<AvailableContainersInfoTab>("namespaces");

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
                console.log("Project found", foundProject);
                setNamespaces(foundProject.containerNamespaces);
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
                router.push("/services/containers");
            });
    }, [router, projectId]);

    const handleClick = (tab: "namespaces") => {
        setActiveTab(tab);
    };

    return (
        <>
            <div className="z-10 flex w-full flex-col items-center justify-center">
                <div className="flex w-4/5 flex-row items-center justify-between">
                    <h2 className="mb-5 w-4/5 text-4xl font-bold">
                        {project?.name}
                    </h2>
                </div>
                {loading && project == null ? (
                    <LoadingSpinner />
                ) : (
                    <>
                        <TabsContainersInfo
                            tab={activeTab}
                            onClick={(tab: AvailableContainersInfoTab) => {
                                setActiveTab(tab);
                            }}
                        />
                        <ContainersNamespaces
                            session={session}
                            project={project!}
                            namespaces={namespaces}
                            reloadNamespaces={() => {
                                getProject(projectId)
                                    .then((foundProject) => {
                                        setProject(foundProject);
                                        console.log(
                                            "Project found",
                                            foundProject,
                                        );
                                        setNamespaces(
                                            foundProject.containerNamespaces,
                                        );
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
                                        router.push("/services/containers");
                                    });
                            }}
                        />
                    </>
                )}
            </div>
        </>
    );
}
