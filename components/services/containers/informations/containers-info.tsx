"use client";
import { Session } from "next-auth";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Project } from "@/lib/models/project";
import { toastEventEmitter } from "@/lib/event-emitter/toast-event-emitter";
import { LoadingSpinner } from "@/components/shared/icons";
import ContainersNamespaces from "@/components/services/containers/informations/containers-namespaces";
import { ContainerApplicationNamespace } from "@/lib/models/containers/container-application-namespace";
import TabsContainersInfo from "@/components/services/containers/informations/tabs-containers-info";
import axios from "axios";
import { DisplayToast } from "@/components/shared/toast/display-toast";
import { ContainerNamespace } from "@/lib/models/containers/prisma/container-namespace";
import { log } from "console";

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
    const [namespaces, setNamespaces] = useState<ContainerNamespace[] | null>(
        null,
    );
    const [namespacesInAPI, setNamespacesInAPI] = useState<
        ContainerApplicationNamespace[] | null
    >(null);

    const [activeTab, setActiveTab] =
        useState<AvailableContainersInfoTab>("namespaces");

    const getProject = async (projectId: string) => {
        try {
            const res = await axios.get(`/api/projects/${projectId}`);
            return res.data;
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
                setNamespaces(foundProject.containerNamespaces);
                getNamespaces(foundProject.id)
                    .then((namespaces) => {
                        setNamespacesInAPI(namespaces);
                    })
                    .catch((error) => {
                        console.log(`error when try to get namespaces`, error);
                        DisplayToast({
                            type: "error",
                            message:
                                // TODO: Mettre ça partout
                                "We are sorry, we encountered a problem. Please try again or contact support",
                            duration: 3000,
                        });
                        router.push(`/projects/${projectId}`);
                    });
            })
            .catch((error) => {
                DisplayToast({
                    type: "error",
                    message:
                        "Could not get project, please try again later or contact support",
                    duration: 3000,
                });
                console.error(
                    "error when try to get project in containers list page",
                    error,
                );
                router.push("/services/containers");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [projectId]);

    const handleClick = (tab: "namespaces") => {
        setActiveTab(tab);
    };

    const getNamespaces = async (projectID: string) => {
        const res = await axios.get(
            `/api/projects/${projectID}/services/containers/namespaces`,
        );
        return res.data;
    };
    const reloadNamespaces = async () => {
        getProject(projectId)
            .then((foundProject) => {
                setProject(foundProject);
                setNamespaces(foundProject.containerNamespaces);
                getNamespaces(foundProject.id)
                    .then((namespaces) => {
                        setNamespacesInAPI(namespaces);
                    })
                    .catch((error) => {
                        DisplayToast({
                            type: "error",
                            message:
                                "Could not get namespaces, please try again later or contact support",
                            duration: 3000,
                        });
                    });
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

                        {!loading &&
                            activeTab === "namespaces" &&
                            namespaces &&
                            namespacesInAPI && (
                                <ContainersNamespaces
                                    session={session}
                                    project={project!}
                                    namespaces={namespaces}
                                    namespacesInAPI={namespacesInAPI}
                                    reloadNamespaces={async () => {
                                        await reloadNamespaces();
                                    }}
                                />
                            )}
                    </>
                )}
            </div>
        </>
    );
}
