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

export default function ContainerStatus({
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

    const [containerStatus, setContainerStatus] = useState<any | undefined>(
        undefined,
    );

    const getStatus = async (applicationId: string, userId: string) => {
        const statusResponse = await axios.get(
            `/api/projects/${project.id}/services/containers/namespaces/${container.container.namespace.id}/applications/${applicationId}/status`,
        );
        return statusResponse.data.status;
    };

    const loadStatus = async () => {
        getStatus(container.container.id, userId)
            .then((status) => {
                setContainerStatus(status);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                DisplayToast({
                    type: "error",
                    message: `Couldn't get status of container ${container.container.name}, please try again later or contact support.`,
                    duration: 5000,
                });
                setLoading(false);
            });
    };

    // Load metrics every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            if (!container) return;
            loadStatus();
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!container) return;
        setLoading(true);
        loadStatus();
    }, []);

    const getPodState = (pod: any) => {
        var state;
        var firstContainerStatus = pod.status.containerStatuses[0];
        if (firstContainerStatus.state.waiting) {
            state = firstContainerStatus.state.waiting;
        } else if (firstContainerStatus.state.running) {
            state = firstContainerStatus.state.running;
        } else if (firstContainerStatus.state.terminated) {
            state = firstContainerStatus.state.terminated;
        }
        return state;
    };

    const getPodLastTerminationState = (pod: any) => {
        var state = null;
        var firstContainerStatus = pod.status.containerStatuses[0];
        if (firstContainerStatus.lastTerminationState.waiting) {
            state = firstContainerStatus.lastTerminationState.waiting;
        } else if (firstContainerStatus.lastTerminationState.running) {
            state = firstContainerStatus.lastTerminationState.running;
        } else if (firstContainerStatus.lastTerminationState.terminated) {
            state = firstContainerStatus.lastTerminationState.terminated;
        }
        return state;
    };

    return (
        <>
            {loading && <LoadingSpinner />}
            {!loading && !containerStatus && (
                <div className="z-10 flex w-full flex-col items-center justify-center">
                    <div className="flex w-4/5 flex-col items-center justify-center">
                        <h1 className="text-xl font-bold">
                            Status is not available.
                        </h1>
                    </div>
                </div>
            )}
            {!loading && containerStatus && (
                <div className="z-10 flex w-full flex-col items-center justify-center">
                    <div className="flex w-4/5 flex-col items-center justify-center">
                        {/*  Display the following fields from status :  */}
                        {/* "
                        replicas": 1,
                        "availableReplicas": 0,
                        "unavailableReplicas": 1,
                        "readyReplicas": 0,
                        "desiredReplicas": 1,
                        "currentReplicas": 1,
                        "updatedReplicas": 1, 
                        */}
                        <div className="flex w-full flex-col">
                            <h1 className="pb-3 text-2xl font-bold">
                                Replicas status :
                            </h1>
                            <div className="ms-5 flex flex-col gap-1">
                                <div className="flex w-full flex-row gap-2">
                                    <span>Replicas:</span>
                                    <span className="font-semibold">
                                        {containerStatus.replicas}
                                    </span>
                                </div>
                                <div className="flex w-full flex-row gap-2">
                                    <span>Available Replicas:</span>
                                    <span className="font-semibold">
                                        {containerStatus.availableReplicas}
                                    </span>
                                </div>
                                <div className="flex w-full flex-row gap-2">
                                    <span>Unavailable Replicas:</span>
                                    <span className="font-semibold">
                                        {containerStatus.unavailableReplicas}
                                    </span>
                                </div>
                                <div className="flex w-full flex-row gap-2">
                                    <span>Ready Replicas:</span>
                                    <span className="font-semibold">
                                        {containerStatus.readyReplicas}
                                    </span>
                                </div>
                                <div className="flex w-full flex-row gap-2">
                                    <span>Desired Replicas:</span>
                                    <span className="font-semibold">
                                        {containerStatus.desiredReplicas}
                                    </span>
                                </div>
                                <div className="flex w-full flex-row gap-2">
                                    <span>Current Replicas:</span>
                                    <span className="font-semibold">
                                        {containerStatus.currentReplicas}
                                    </span>
                                </div>
                                <div className="flex w-full flex-row gap-2">
                                    <span>Updated Replicas:</span>
                                    <span className="font-semibold">
                                        {containerStatus.updatedReplicas}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-10 flex w-full flex-col gap-2">
                            <h1 className="text-2xl font-bold">
                                Pods status :
                            </h1>
                            {containerStatus.podList.items.length > 0 &&
                                containerStatus.podList.items.map(
                                    (pod: any) => {
                                        return (
                                            <div
                                                className="m-3 w-full rounded-lg border-2 border-dashed border-green-300 p-5"
                                                key={pod.metadata.name}
                                            >
                                                <h1 className="text-2xl font-bold">
                                                    {pod.metadata.name}
                                                </h1>
                                                <div className="mt-5 flex w-full flex-col">
                                                    <div className="flex w-full flex-col items-start gap-2">
                                                        <div className="flex w-full flex-row gap-4">
                                                            <h4 className="text-md">
                                                                Phase:
                                                            </h4>
                                                            <h4 className="text-md font-semibold">
                                                                {
                                                                    pod.status
                                                                        .phase
                                                                }
                                                            </h4>
                                                        </div>
                                                        <div className="flex w-full flex-row gap-4">
                                                            <h4 className="text-md">
                                                                Ready:
                                                            </h4>
                                                            <h4 className="text-md font-semibold">
                                                                {pod.status
                                                                    .containerStatuses[0]
                                                                    .ready ===
                                                                true
                                                                    ? "Yes"
                                                                    : "No"}
                                                            </h4>
                                                        </div>
                                                        <div className="flex w-full flex-row gap-4">
                                                            <h4 className="text-md">
                                                                Restart count:
                                                            </h4>
                                                            <h4 className="text-md font-semibold">
                                                                {
                                                                    pod.status
                                                                        .containerStatuses[0]
                                                                        .restartCount
                                                                }
                                                            </h4>
                                                        </div>
                                                        {/* use state & lastTerminationState */}
                                                        <div className="flex w-full flex-col">
                                                            <h4 className="text-md">
                                                                State:
                                                            </h4>
                                                            <div className="ms-10 flex w-5/6 flex-col">
                                                                {getPodState(
                                                                    pod,
                                                                ) && (
                                                                    <div className="flex w-full flex-col">
                                                                        {getPodState(
                                                                            pod,
                                                                        )
                                                                            .startedAt && (
                                                                            <div className="flex w-full flex-row gap-4">
                                                                                <h4 className="text-md">
                                                                                    Started
                                                                                    at:
                                                                                </h4>
                                                                                <h4 className="text-md font-semibold">
                                                                                    {
                                                                                        getPodState(
                                                                                            pod,
                                                                                        )
                                                                                            .startedAt
                                                                                    }
                                                                                </h4>
                                                                            </div>
                                                                        )}
                                                                        {getPodState(
                                                                            pod,
                                                                        )
                                                                            .reason && (
                                                                            <div className="flex w-full flex-row gap-4">
                                                                                <h4 className="text-md">
                                                                                    Reason:
                                                                                </h4>
                                                                                <h4 className="text-md font-semibold">
                                                                                    {
                                                                                        getPodState(
                                                                                            pod,
                                                                                        )
                                                                                            .reason
                                                                                    }
                                                                                </h4>
                                                                            </div>
                                                                        )}
                                                                        {getPodState(
                                                                            pod,
                                                                        )
                                                                            .message && (
                                                                            <div className="flex w-full flex-row gap-4">
                                                                                <h4 className="text-md">
                                                                                    Message:
                                                                                </h4>
                                                                                <h4 className="text-md break-all font-semibold">
                                                                                    {
                                                                                        getPodState(
                                                                                            pod,
                                                                                        )
                                                                                            .message
                                                                                    }
                                                                                </h4>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {getPodLastTerminationState(
                                                            pod,
                                                        ) && (
                                                            <div className="flex w-full flex-col">
                                                                <h4 className="text-md">
                                                                    Last
                                                                    termination
                                                                </h4>
                                                                <div className="ms-10 flex w-5/6 flex-col">
                                                                    <div className="flex w-full flex-col">
                                                                        {getPodLastTerminationState(
                                                                            pod,
                                                                        )
                                                                            .exitCode && (
                                                                            <div className="flex w-full flex-row gap-4">
                                                                                <h4 className="text-md">
                                                                                    Exit
                                                                                    code:
                                                                                </h4>
                                                                                <h4 className="text-md font-semibold">
                                                                                    {
                                                                                        getPodLastTerminationState(
                                                                                            pod,
                                                                                        )
                                                                                            .exitCode
                                                                                    }
                                                                                </h4>
                                                                            </div>
                                                                        )}

                                                                        {getPodLastTerminationState(
                                                                            pod,
                                                                        )
                                                                            .signal && (
                                                                            <div className="flex w-full flex-row gap-4">
                                                                                <h4 className="text-md">
                                                                                    Signal:
                                                                                </h4>
                                                                                <h4 className="text-md font-semibold">
                                                                                    {
                                                                                        getPodLastTerminationState(
                                                                                            pod,
                                                                                        )
                                                                                            .signal
                                                                                    }
                                                                                </h4>
                                                                            </div>
                                                                        )}
                                                                        {getPodLastTerminationState(
                                                                            pod,
                                                                        )
                                                                            .reason && (
                                                                            <div className="flex w-full flex-row gap-4">
                                                                                <h4 className="text-md">
                                                                                    Reason:
                                                                                </h4>
                                                                                <h4 className="text-md font-semibold">
                                                                                    {
                                                                                        getPodLastTerminationState(
                                                                                            pod,
                                                                                        )
                                                                                            .reason
                                                                                    }
                                                                                </h4>
                                                                            </div>
                                                                        )}
                                                                        {getPodLastTerminationState(
                                                                            pod,
                                                                        )
                                                                            .message && (
                                                                            <div className="flex flex-row gap-4">
                                                                                <h4 className="text-md">
                                                                                    Message:
                                                                                </h4>
                                                                                <h4 className="text-md break-all font-semibold">
                                                                                    {
                                                                                        getPodLastTerminationState(
                                                                                            pod,
                                                                                        )
                                                                                            .message
                                                                                    }
                                                                                </h4>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="flex w-full flex-row gap-4">
                                                            <h4 className="text-md">
                                                                Image:
                                                            </h4>
                                                            <h4 className="text-md font-semibold">
                                                                {
                                                                    pod.status
                                                                        .containerStatuses[0]
                                                                        .image
                                                                }
                                                            </h4>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    },
                                )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
