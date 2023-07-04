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
            {!loading && metrics.length === 0 && (
                <div className="z-10 flex w-full flex-col items-center justify-center">
                    <div className="flex w-4/5 flex-col items-center justify-center">
                        <h1 className="text-xl font-bold">
                            No metrics available for this container.
                        </h1>
                    </div>
                </div>
            )}
            {!loading && metrics.length > 0 && (
                <div className="z-10 flex w-full flex-col items-center justify-center">
                    <div className="flex w-4/5 flex-col items-center justify-center">
                        {container.containerInAPI.applicationType ===
                            "LOAD_BALANCED" && (
                            <div className="flex w-full flex-col items-start justify-start gap-1">
                                <h1 className="text-xl font-bold">
                                    Reminder of your scalability specifications
                                    :{" "}
                                </h1>
                                <div className="flex w-full flex-row items-start justify-start gap-1">
                                    <h1 className="font-semibold">
                                        CPU Usage threshold :{" "}
                                    </h1>
                                    <h2>
                                        {container.containerInAPI.scalabilitySpecifications?.cpuUsagePercentageThreshold.toPrecision(
                                            2,
                                        )}
                                        %
                                    </h2>
                                </div>
                                <div className="flex w-full flex-row items-start justify-start gap-1">
                                    <h1 className="font-semibold">
                                        Memory Usage threshold :{" "}
                                    </h1>
                                    <h2>
                                        {container.containerInAPI.scalabilitySpecifications?.memoryUsagePercentageThreshold.toPrecision(
                                            2,
                                        )}
                                        %
                                    </h2>
                                </div>
                            </div>
                        )}

                        {metrics.map((metric) => (
                            <div
                                className="m-3 w-full rounded-lg border border-2 border-dashed border-green-300 p-5"
                                key={metric.podName}
                            >
                                <h1 className="text-2xl font-bold">
                                    {metric.podName}
                                </h1>
                                <div className="mt-5 flex w-full flex-row items-center justify-center">
                                    <div className="flex w-1/2 flex-col items-center justify-center gap-4">
                                        <div className="flex w-full flex-row items-center justify-center gap-4">
                                            <h4 className="text-md">
                                                CPU Usage
                                            </h4>
                                            <h4 className="text-md font-bold">
                                                {metric.cpuUsage} /{" "}
                                                {metric.maxCpuUsage}
                                            </h4>
                                        </div>
                                        <h5 className="text-md">
                                            Equivalent :{" "}
                                            {metric.cpuUsageInPercentage.toPrecision(
                                                2,
                                            )}
                                            %
                                        </h5>
                                    </div>

                                    <div className="flex w-1/2 flex-col items-center justify-center gap-4">
                                        <div className="flex w-full flex-row items-center justify-center gap-4">
                                            <h4 className="text-md">
                                                Memory Usage
                                            </h4>
                                            <h4 className="text-md font-bold">
                                                {memoryToMB(metric.memoryUsage)}{" "}
                                                / {metric.maxMemoryUsage}
                                            </h4>
                                        </div>
                                        <h5 className="text-md">
                                            Equivalent :{" "}
                                            {metric.memoryUsageInPercentage.toPrecision(
                                                2,
                                            )}
                                            %
                                        </h5>
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
