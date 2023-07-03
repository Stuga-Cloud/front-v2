"use client";
import { Session } from "next-auth";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Project } from "@/lib/models/project";
import { ContainerApplicationNamespace } from "@/lib/models/containers/container-application-namespace";
import { LoadingSpinner } from "@/components/shared/icons";
import { ContainerRetrieved } from "@/components/services/containers/applications/details/container-details";
import axios from "axios";
import { DisplayToast } from "@/components/shared/toast/display-toast";
import { ContainerApplicationMetrics } from "@/lib/models/containers/container-application-metrics";
import { memoryToMB } from "@/lib/models/containers/container-application";

export default function ContainerMetrics({
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

    const userId = (session.user as any).id;

    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [metrics, setMetrics] = useState<ContainerApplicationMetrics[]>([]);

    const getMetrics = async (applicationId: string, userId: string) => {
        const metricsResponse = await axios.get(
            `/api/projects/${project.id}/services/containers/namespaces/${container.container.namespace.id}/applications/${applicationId}/metrics`,
        );
        console.log(metricsResponse);
        return metricsResponse.data.metrics;
    };

    const loadMetrics = async () => {
        getMetrics(container.container.id, userId)
            .then((metrics) => {
                setMetrics(metrics);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                DisplayToast({
                    type: "error",
                    message: `Couldn't get metrics of container ${container.container.name}, please try again later or contact support.`,
                    duration: 5000,
                });
                setLoading(false);
            });
    };

    // Load metrics every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            if (!container) return;
            loadMetrics();
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!container) return;
        setLoading(true);
        loadMetrics();
    }, []);

    return (
        <>
            {loading && <LoadingSpinner />}
            {!loading && metrics && (
                <div className="z-10 flex w-full flex-col items-center justify-center">
                    <div className="flex w-4/5 flex-col items-center justify-center">
                        {metrics.map((metric) => (
                            <div
                                className="m-3 w-full rounded-lg border border-2 border-dashed border-green-300 p-3"
                                key={metric.podName}
                            >
                                <h1 className="text-2xl font-bold">
                                    {metric.podName}
                                </h1>
                                <div className="flex w-full flex-row items-center justify-center">
                                    <div className="flex w-1/2 flex-row items-center justify-center gap-4">
                                        <h4 className="text-md">CPU Usage</h4>
                                        <h4 className="text-md font-bold">
                                            {metric.cpuUsage} /{" "}
                                            {metric.maxCpuUsage}
                                        </h4>
                                    </div>
                                    <div className="flex w-1/2 flex-row items-center justify-center gap-4">
                                        <h4 className="text-md">
                                            Memory Usage
                                        </h4>
                                        <h4 className="text-md font-bold">
                                            {memoryToMB(metric.memoryUsage)} /{" "}
                                            {metric.maxMemoryUsage}
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
