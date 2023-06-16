"use client";
import { Session } from "next-auth";
import React, { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { Project } from "@/lib/models/project";
import { LoadingSpinner } from "@/components/shared/icons";
import { DisplayToast } from "@/components/shared/toast/display-toast";
import TabsNamespaceInfo from "@/components/services/containers/namespaces/details/tabs-namespace-info";
import NamespaceContainers from "@/components/services/containers/namespaces/details/namespace-containers";
import { ContainerApplication } from "@/lib/models/containers/container-application";
import { ContainerApplicationNamespace } from "@/lib/models/containers/container-application-namespace";
import axios from "axios";
import NamespaceSettings from "@/components/services/containers/namespaces/details/namespace-settings";
import { ContainerNamespace } from "@/lib/models/containers/prisma/container-namespace";

export type AvailableContainerNamespaceTabs = "containers" | "settings";

export default function NamespaceDetails({
    session,
    projectId,
    namespaceId,
}: {
    session: Session | null;
    projectId: string;
    namespaceId: string;
}) {
    if (!session) redirect("/");

    const user = session?.user;
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [activeTab, setActiveTab] =
        useState<AvailableContainerNamespaceTabs>("containers");

    const [project, setProject] = useState<Project | null>(null);
    const [namespace, setNamespace] = useState<ContainerNamespace | null>(null);
    const [namespaceInAPI, setNamespaceInAPI] =
        useState<ContainerApplicationNamespace | null>(null);
    const [containers, setContainers] = useState<ContainerApplication[]>([]);

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
                DisplayToast({
                    type: "error",
                    message:
                        "Could not retrieve project information, please try again later or contact support",
                    duration: 3000,
                });
                console.error(
                    "error when try to get project in namespace details",
                    error,
                );
                setLoading(false);
                router.push("/services/containers");
            });
    }, [projectId]);

    const loadNamespace = async () => {
        try {
            const res = await axios.get(
                `/api/projects/${projectId}/services/containers/namespaces/${namespaceId}`,
            );
            setNamespace(res.data.namespace);
            setNamespaceInAPI(res.data.namespaceInAPI);
            setContainers(res.data.namespaceInAPI.applications || []);
        } catch (error) {
            console.log(error);
            DisplayToast({
                type: "error",
                message:
                    "Could not retrieve namespace information, please try again later or contact support",
                duration: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    // Reload namespace every 30 seconds
    useEffect(() => {
        const interval = setInterval(async () => {
            await loadNamespace();
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!projectId || !namespaceId) return;
        setLoading(true);
        loadNamespace()
            .then(() => {
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                DisplayToast({
                    type: "error",
                    message:
                        "Could not retrieve namespace information, please try again later or contact support",
                    duration: 3000,
                });
            });
    }, [projectId, namespaceId]);

    return (
        <>
            <div className="z-10 flex w-full flex-col items-center justify-center">
                <div className="flex w-4/5 flex-row items-center justify-between">
                    <h2 className="mb-5 w-4/5 text-4xl font-bold">
                        {namespace?.name}
                    </h2>
                </div>
                {loading && project == null ? (
                    <LoadingSpinner />
                ) : (
                    <>
                        <TabsNamespaceInfo
                            tab={activeTab}
                            onClick={(tab) => {
                                setActiveTab(tab);
                            }}
                        />
                        {!loading &&
                            namespace &&
                            activeTab === "containers" && (
                                <NamespaceContainers
                                    session={session}
                                    project={project!}
                                    namespace={namespace}
                                    namespaceInAPI={namespaceInAPI!}
                                    containers={containers}
                                    reloadContainers={async () => {
                                        setLoading(true);
                                        await loadNamespace();
                                    }}
                                />
                            )}
                        {!loading && namespace && activeTab === "settings" && (
                            <NamespaceSettings
                                session={session}
                                project={project!}
                                namespace={namespace}
                                namespaceInAPI={namespaceInAPI!}
                                reloadNamespace={async () => {
                                    setLoading(true);
                                    await loadNamespace();
                                }}
                            />
                        )}
                    </>
                )}
            </div>
        </>
    );
}
