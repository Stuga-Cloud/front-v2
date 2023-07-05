"use client";
import { Session } from "next-auth";
import { redirect, useRouter } from "next/navigation";
import React, { useState } from "react";
import { Project } from "@/lib/models/project";
import { ContainerApplicationNamespace } from "@/lib/models/containers/container-application-namespace";
import { LoadingSpinner } from "@/components/shared/icons";
import { applicationStatusToComponent } from "@/lib/services/containers/application-status-to-component";
import { DisplayToast } from "@/components/shared/toast/display-toast";
import axios from "axios";
import { ContainerRetrieved } from "@/components/services/containers/applications/details/container-details";
import {
    humanizeContainerCPULimitSpecifications,
    humanizeContainerMemoryLimitSpecifications,
} from "@/lib/models/containers/container-application";
import ConfirmDeleteContainerApplicationModal from "./modal-delete-container-application-confirm";

export default function ContainerPreview({
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

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isDeleteModalOpened, setIsDeleteModalOpened] = useState(false);

    const deleteContainer = async () => {
        setLoading(true);
        try {
            const res = await axios.delete(
                `/api/projects/${project.id}/services/containers/namespaces/${container.container.namespace.id}/applications/${container.container.id}`,
            );
            if (res.status === 200) {
                DisplayToast({
                    type: "success",
                    message: `Container ${container.containerInAPI.name} successfully deleted.`,
                });
                router.push(
                    `/projects/${project.id}/services/containers/namespaces/${container.container.namespace.id}`,
                );
            } else {
                DisplayToast({
                    type: "error",
                    message: `Could not delete container ${container.containerInAPI.name}, please try again later or contact support.`,
                });
            }
        } catch (error) {
            console.log(error);
            DisplayToast({
                type: "error",
                message: `Could not delete container ${container.containerInAPI.name}, please try again later or contact support.`,
            });
        } finally {
            setLoading(false);
        }
    };

    const getURLOfContainer = (container: ContainerRetrieved): string => {
        const containerDomain = process.env.NEXT_PUBLIC_BASE_CONTAINER_DOMAIN;
        const containerName = container.containerInAPI.name.toLowerCase();
        const containerNamespace =
            container.containerInAPI.namespace.name.toLowerCase();
        return `${containerName}.${containerNamespace}.${containerDomain}`;
    };

    return (
        <>
            {loading && <LoadingSpinner />}
            <div className="mt-10 w-4/5">
                <div className="w-full rounded-lg border border-2 border-dashed border-green-300 p-3">
                    <div className="flex flex-row items-start justify-between gap-3 pb-5 ps-5 pt-5">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-xl font-bold">Status</h2>
                            <span>
                                {applicationStatusToComponent(
                                    container.containerInAPI.status,
                                )}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-row items-start justify-between gap-3 pb-5 ps-5 pt-5">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-xl font-bold">End point</h2>
                            <a
                                href={`https://${getURLOfContainer(container)}`}
                                target="_blank"
                                className="text-blue-500 hover:text-blue-700"
                                rel="noreferrer"
                            >
                                {getURLOfContainer(container)}
                                {/* AppName.NamespaceName.hive.williamquach.fr */}
                                {/* use NEXT_PUBLIC_BASE_CONTAINER_DOMAIN env to get hive.williamquach.fr */}
                            </a>
                        </div>
                    </div>
                    <div className="flex flex-row items-start gap-3 pb-5 ps-5 pt-5">
                        <div className="flex w-1/2 flex-col gap-1">
                            <h2 className="text-xl font-bold">
                                Configured resources
                            </h2>
                            <span>
                                {container.containerInAPI
                                    .containerSpecifications.cpuLimit
                                    ? humanizeContainerCPULimitSpecifications(
                                          container.containerInAPI
                                              .containerSpecifications.cpuLimit,
                                      )
                                    : "No CPU limit"}
                            </span>
                            <span>
                                {container.containerInAPI
                                    .containerSpecifications.memoryLimit
                                    ? humanizeContainerMemoryLimitSpecifications(
                                          container.containerInAPI
                                              .containerSpecifications
                                              .memoryLimit,
                                      )
                                    : "No memory limit"}
                            </span>
                        </div>
                    </div>
                    {container.containerInAPI.applicationType ===
                        "LOAD_BALANCED" && (
                        <div className="flex flex-row items-start gap-3 pb-5 ps-5 pt-5">
                            <div className="flex flex-col gap-1">
                                <h2 className="text-xl font-bold">
                                    Scalability specifications
                                </h2>
                                <div className="flex flex-row gap-1">
                                    <div>
                                        <span className="italic">
                                            Replicas:{" "}
                                        </span>
                                    </div>
                                    <div>
                                        <strong>
                                            {container.containerInAPI
                                                .scalabilitySpecifications
                                                ?.replicas
                                                ? `${container.containerInAPI.scalabilitySpecifications.replicas}`
                                                : "none"}
                                        </strong>
                                    </div>
                                </div>

                                <div className="flex flex-row gap-1">
                                    <div>
                                        <span className="italic">
                                            CPU usage percentage threshold:{" "}
                                        </span>
                                    </div>
                                    <div>
                                        <strong>
                                            {container.containerInAPI
                                                .scalabilitySpecifications
                                                ?.cpuUsagePercentageThreshold
                                                ? `${container.containerInAPI.scalabilitySpecifications.cpuUsagePercentageThreshold}%`
                                                : "none"}
                                        </strong>
                                    </div>
                                </div>

                                <div className="flex flex-row gap-1">
                                    <div>
                                        <span className="italic">
                                            Memory usage percentage threshold:{" "}
                                        </span>
                                    </div>
                                    <div>
                                        <strong>
                                            {container.containerInAPI
                                                .scalabilitySpecifications
                                                ?.memoryUsagePercentageThreshold
                                                ? `${container.containerInAPI.scalabilitySpecifications.memoryUsagePercentageThreshold}%`
                                                : "none"}
                                        </strong>
                                    </div>
                                </div>

                                <div className="flex flex-row gap-1">
                                    <div>
                                        <span className="italic">
                                            Scaling mode:{" "}
                                        </span>
                                    </div>
                                    <div>
                                        <strong>
                                            {container.containerInAPI
                                                .scalabilitySpecifications
                                                ?.isAutoScaled
                                                ? "Auto scaled"
                                                : "Manually scaled"}
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="mb-5 ms-5 mt-5 flex flex w-full flex-col gap-1">
                        <h2 className="text-xl font-bold">Description</h2>
                        <span>
                            {container.containerInAPI.description
                                ? container.containerInAPI.description
                                : "No description"}
                        </span>
                    </div>
                </div>

                <div className="mt-10 w-full rounded-lg border border-2 border-dashed border-green-300 p-3">
                    {/* Here will be displayed in this dashed rectangle :
                    - The possibility to delete the container
                    */}
                    <div className="flex flex w-full flex-col gap-1 p-5">
                        <h2 className="text-xl font-bold">Operations</h2>
                        <div className="flex flex-row items-center gap-1 pt-10">
                            <span className="w-4/5 font-semibold text-red-500">
                                This will permanently delete this container and
                                all associated data.
                            </span>
                            <button
                                type="button"
                                className="Button stuga-red-color"
                                onClick={() => setIsDeleteModalOpened(true)}
                            >
                                Delete container
                            </button>
                            <ConfirmDeleteContainerApplicationModal
                                text={
                                    "Are you sure you want to delete this application?"
                                }
                                onClose={() => setIsDeleteModalOpened(false)}
                                isOpenFromParent={isDeleteModalOpened}
                                deleteAction={async () => {
                                    await deleteContainer();
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
