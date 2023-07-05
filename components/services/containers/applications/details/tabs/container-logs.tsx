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
import { ContainerApplicationLogs } from "@/lib/models/containers/container-application-logs";

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

    const userId = (session.user as any).id;

    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [logs, setLogs] = useState<ContainerApplicationLogs[]>([]);
    const [currentPod, setCurrentPod] = useState<string>("");
    const [currentLogs, setCurrentLogs] = useState<string>("");

    const findLogs = (podName: string) => {
        const log = logs.find((log) => log.podName === podName);
        if (!log) return "";
        return log.logs;
    };

    const getLogs = async (applicationId: string, userId: string) => {
        const logsResponse = await axios.get(
            `/api/projects/${project.id}/services/containers/namespaces/${container.container.namespace.id}/applications/${applicationId}/logs`,
        );
        return logsResponse.data.logs;
    };

    const loadLogs = async () => {
        getLogs(container.container.id, userId)
            .then((logs) => {
                setLogs(logs);
                setCurrentPod(logs[0].podName);
                setCurrentLogs(logs[0].logs);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                DisplayToast({
                    type: "error",
                    message: `Couldn't get logs of container ${container.container.name}, please try again later or contact support.`,
                    duration: 5000,
                });
                setLoading(false);
            });
    };

    // Load logs every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            if (!container) return;
            loadLogs();
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!container) return;
        setLoading(true);
        loadLogs();
    }, []);

    return (
        <>
            {loading && <LoadingSpinner />}
            {!loading && logs && (
                <div className="z-10 flex w-full flex-col items-center justify-center">
                    <div className="mb-2 flex w-4/5 flex-col">
                        <label
                            htmlFor="pod-name"
                            className="mb-2 block text-sm font-medium text-gray-900"
                        >
                            Select a pod
                        </label>
                        <select
                            id="pod-name"
                            name="pod-name"
                            className="bg-gray-40 mb-2 block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500"
                            onChange={(e) => {
                                setCurrentPod(e.target.value);
                                setCurrentLogs(findLogs(e.target.value));
                            }}
                        >
                            {logs.map((log, index) => (
                                <option key={index} value={log.podName}>
                                    {log.podName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex w-4/5 flex-col items-center justify-center">
                        <textarea
                            className="h-96 w-full rounded-lg border border-gray-300 bg-gray-900 p-2.5 text-sm text-white focus:border-green-500 focus:ring-green-500"
                            value={currentLogs}
                            readOnly
                            ref={(el) => {
                                if (!el) return;
                                el.scrollTop = el.scrollHeight;
                            }}
                        />
                        <button
                            className="mt-2 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                            onClick={() => {
                                navigator.clipboard.writeText(currentLogs);
                                DisplayToast({
                                    type: "success",
                                    message: "Copied logs to clipboard!",
                                    duration: 5000,
                                });
                            }}
                        >
                            Copy to clipboard
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
