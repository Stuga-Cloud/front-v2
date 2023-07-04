"use client";
import { Session } from "next-auth";
import React, { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { Project } from "@/lib/models/project";
import { toastEventEmitter } from "@/lib/event-emitter/toast-event-emitter";
import { LoadingSpinner } from "@/components/shared/icons";
import axios, { AxiosError } from "axios";
import { DisplayToast } from "@/components/shared/toast/display-toast";
import TabsContainerDetails from "@/components/services/containers/applications/details/tabs/tabs-container-details";
import { ContainerApplication } from "@/lib/models/containers/container-application";
import ContainerPreview from "@/components/services/containers/applications/details/tabs/container-preview";
import ContainerDeployment from "@/components/services/containers/applications/details/tabs/container-deployment";
import ContainerMetrics from "@/components/services/containers/applications/details/tabs/container-metrics";
import ContainerLogs from "@/components/services/containers/applications/details/tabs/container-logs";
import { Container } from "@/lib/models/containers/prisma/container";
import ContainerStatus from "./tabs/container-status";

export type AvailableContainerDetailsTabs =
    | "preview"
    | "deployment"
    | "logs"
    | "metrics"
    | "status";

export interface ContainerRetrieved {
    container: Container;
    containerInAPI: ContainerApplication;
}

export default function ContainerDetails({
    session,
    projectId,
    containerId,
    namespaceId,
}: {
    session: Session | null;
    projectId: string;
    containerId: string;
    namespaceId: string;
}) {
    if (!session) redirect("/");
    const user = session?.user;
    const router = useRouter();

    const [project, setProject] = useState<Project | null>(null);
    const [container, setContainer] = useState<ContainerRetrieved | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [activeTab, setActiveTab] =
        useState<AvailableContainerDetailsTabs>("preview");

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

    const getContainer = async (containerId: string) => {
        try {
            const res = await axios.get(
                `/api/projects/${projectId}/services/containers/namespaces/${namespaceId}/applications/${containerId}`,
            );
            return res.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    const loadContainer = async () => {
        getContainer(containerId)
            .then((foundContainer) => {
                setContainer(foundContainer);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                console.log(`error when try to get container`, error);
                if (error instanceof AxiosError) {
                    if (
                        error.response?.status === 403 ||
                        error.response?.status === 401
                    ) {
                        DisplayToast({
                            type: "error",
                            message:
                                "You are not authorized to access this application, please contact your project admin's",
                            duration: 3000,
                        });
                    }
                } else {
                    DisplayToast({
                        type: "error",
                        message: `Could not find container, please try again later or contact support.`,
                    });
                }

                router.push(
                    `/projects/${projectId}/services/containers/namespaces/${namespaceId}`,
                );
            });
    };

    // Reload container every 10 seconds
    useEffect(() => {
        const interval = setInterval(async () => {
            if (!container) return;
            await loadContainer();
        }, 10000);
        return () => clearInterval(interval);
    }, [container]);

    useEffect(() => {
        if (!containerId) return;
        setLoading(true);
        loadContainer().catch((error) => {
            console.log(error);
            DisplayToast({
                type: "error",
                message: `Could not find container, please try again later or contact support.`,
            });
            router.push(
                `/projects/${projectId}/services/containers/namespaces/${namespaceId}`,
            );
        });
    }, [containerId]);

    return (
        <>
            <div className="z-10 flex w-full flex-col items-center justify-center">
                {loading || !project || (!container && <LoadingSpinner />)}
                {container && project && (
                    <>
                        <div className="flex w-4/5 flex-col items-start justify-start">
                            <h2 className="text-4xl font-bold">
                                {container.containerInAPI.name}
                            </h2>
                            <h4 className="mb-5 text-sm text-gray-500">
                                {/*{container.containerInAPI.namespace.name}*/}
                                <a
                                    href={`/projects/${projectId}/services/containers/namespaces/${namespaceId}`}
                                    className="text-gray-500 hover:text-green-600 hover:underline"
                                >
                                    {container.containerInAPI.namespace.name}
                                </a>
                            </h4>
                        </div>
                        <TabsContainerDetails
                            tab={activeTab}
                            onClick={(tab: AvailableContainerDetailsTabs) => {
                                setActiveTab(tab);
                            }}
                        />

                        {activeTab === "preview" && container && (
                            <ContainerPreview
                                session={session}
                                project={project}
                                container={container}
                                namespace={container.containerInAPI.namespace}
                                reloadContainer={async () => {
                                    setLoading(true);
                                    await loadContainer();
                                }}
                            />
                        )}
                        {activeTab === "deployment" && (
                            <ContainerDeployment
                                session={session}
                                project={project}
                                container={container}
                                namespaceInAPI={
                                    container.containerInAPI.namespace
                                }
                                reloadContainer={async () => {
                                    setLoading(true);
                                    await loadContainer();
                                }}
                            />
                        )}
                        {activeTab === "logs" && (
                            <ContainerLogs
                                session={session}
                                project={project}
                                container={container}
                                namespace={container.containerInAPI.namespace}
                                reloadContainer={async () => {
                                    setLoading(true);
                                    await loadContainer();
                                }}
                            />
                        )}
                        {activeTab === "metrics" && (
                            <ContainerMetrics
                                session={session}
                                project={project}
                                container={container}
                                namespace={container.containerInAPI.namespace}
                                reloadContainer={async () => {
                                    setLoading(true);
                                    await loadContainer();
                                }}
                            />
                        )}
                        {activeTab === "status" && (
                            <ContainerStatus
                                session={session}
                                project={project}
                                container={container}
                                namespace={container.containerInAPI.namespace}
                                reloadContainer={async () => {
                                    setLoading(true);
                                    await loadContainer();
                                }}
                            />
                        )}
                        {/*{activeTab === "settings" && (*/}
                        {/*    <ContainerSettings*/}
                        {/*        session={session}*/}
                        {/*        project={project}*/}
                        {/*        container={container}*/}
                        {/*        namespace={container.containerInAPI.namespace}*/}
                        {/*        reloadContainer={async () => {*/}
                        {/*            setLoading(true);*/}
                        {/*            await loadContainer();*/}
                        {/*        }}*/}
                        {/*    />*/}
                        {/*)}*/}
                    </>
                )}
            </div>
        </>
    );
}
