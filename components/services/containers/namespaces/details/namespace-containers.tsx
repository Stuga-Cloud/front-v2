"use client";
import { Session } from "next-auth";
import { redirect, useRouter } from "next/navigation";
import React, { useState } from "react";
import { Project } from "@/lib/models/project";
import { LoadingSpinner } from "@/components/shared/icons";
import { ContainerApplication } from "@/lib/models/containers/container-application";
import { ContainerNamespace } from "@/lib/models/containers/prisma/container-namespace";
import {
    ContainerApplicationNamespace,
    ContainerApplicationNamespaceWithLimits,
} from "@/lib/models/containers/container-application-namespace";
import { applicationStatusToComponent } from "@/lib/services/containers/application-status-to-component";
import Image from "next/image";
import { DisplayToast } from "@/components/shared/toast/display-toast";

export const MAX_APPLICATIONS_BY_USER = Number(
    process.env.NEXT_PUBLIC_MAX_APPLICATIONS_BY_USER,
);
export const MAX_APPLICATIONS_BY_NAMESPACE = Number(
    process.env.NEXT_PUBLIC_MAX_APPLICATIONS_BY_NAMESPACE,
);

export const userHasReachedMaxApplicationsLimit = (
    applicationLimitations: ContainerApplicationNamespaceWithLimits,
    maxApplications: number,
) => {
    return (
        applicationLimitations.hasReachedMaxApplicationsByUser ||
        applicationLimitations.currentApplicationsByUser >= maxApplications
    );
};

export const namespaceHasReachedMaxApplicationsLimit = (
    applicationLimitations: ContainerApplicationNamespaceWithLimits,
    maxApplications: number,
) => {
    return (
        applicationLimitations.hasReachedMaxApplicationsByNamespace ||
        applicationLimitations.currentApplicationsByNamespace >= maxApplications
    );
};

export default function NamespaceContainers({
    session,
    project,
    namespace,
    namespaceInAPI,
    applicationLimitations,
    containers,
    reloadContainers,
}: {
    session: Session;
    project: Project;
    namespace: ContainerNamespace;
    namespaceInAPI: ContainerApplicationNamespace;
    applicationLimitations: ContainerApplicationNamespaceWithLimits;
    containers: ContainerApplication[];
    reloadContainers: () => void;
}) {
    if (!session) redirect("/");
    if (!namespace) redirect(`/projects/${project.id}/services/containers`);

    const router = useRouter();
    const [errorFromMessage, setErrorFormMessage] = useState<string | null>(
        null,
    );
    const [loading, setLoading] = useState(false);

    const getContainerURL = (container: ContainerApplication) => {
        const correspondingContainerInPrisma = namespace.containers.find(
            (c) => c.idInAPI === container.id,
        );
        if (!correspondingContainerInPrisma) {
            return;
        }
        return `/projects/${project?.id}/services/containers/namespaces/${
            namespace.id
        }/applications/${correspondingContainerInPrisma!.id}`;
    };

    const clickOnNewContainerBtn = () => {
        if (
            userHasReachedMaxApplicationsLimit(
                applicationLimitations,
                MAX_APPLICATIONS_BY_USER,
            ) ||
            namespaceHasReachedMaxApplicationsLimit(
                applicationLimitations,
                MAX_APPLICATIONS_BY_NAMESPACE,
            )
        ) {
            if (
                userHasReachedMaxApplicationsLimit(
                    applicationLimitations,
                    MAX_APPLICATIONS_BY_USER,
                )
            ) {
                DisplayToast({
                    type: "error",
                    message: `You reached the maximum number of applications for your account (max: ${applicationLimitations.maxApplicationsByUser})`,
                });
            }
            if (
                namespaceHasReachedMaxApplicationsLimit(
                    applicationLimitations,
                    MAX_APPLICATIONS_BY_NAMESPACE,
                )
            ) {
                DisplayToast({
                    type: "error",
                    message: `You reached the maximum number of applications for this namespace (max: ${applicationLimitations.maxApplicationsByNamespace})`,
                });
            }
            return;
        }
        router.push(
            `/projects/${project.id}/services/containers/namespaces/${namespace.id}/applications/new`,
        );
    };

    return (
        <>
            <div className="z-10 flex w-full flex-col items-center justify-center">
                <div className="mb-4 flex w-4/5 flex-row items-center justify-between">
                    <h2 className="w-3/5 text-sm font-semibold">
                        {/* Display limitation if user has reached the application limit */}
                        {userHasReachedMaxApplicationsLimit(
                            applicationLimitations,
                            MAX_APPLICATIONS_BY_USER,
                        ) && (
                            <span className="text-red-500">
                                You have reached the maximum number of
                                applications for your account (max:{" "}
                                {applicationLimitations.maxApplicationsByUser})
                            </span>
                        )}
                        {userHasReachedMaxApplicationsLimit(
                            applicationLimitations,
                            MAX_APPLICATIONS_BY_USER,
                        ) &&
                            namespaceHasReachedMaxApplicationsLimit(
                                applicationLimitations,
                                MAX_APPLICATIONS_BY_NAMESPACE,
                            ) && <br />}
                        {/* Display limitation if namespace has reached the application limit */}
                        {namespaceHasReachedMaxApplicationsLimit(
                            applicationLimitations,
                            MAX_APPLICATIONS_BY_NAMESPACE,
                        ) && (
                            <span className="text-red-500">
                                {userHasReachedMaxApplicationsLimit(
                                    applicationLimitations,
                                    MAX_APPLICATIONS_BY_USER,
                                )
                                    ? "You have also "
                                    : "You have "}
                                reached the maximum number of applications for
                                this namespace (max:{" "}
                                {
                                    applicationLimitations.maxApplicationsByNamespace
                                }
                                )
                            </span>
                        )}
                    </h2>
                    <button
                        className="Button stuga-primary-color cursor-pointer"
                        onClick={() => {
                            clickOnNewContainerBtn();
                        }}
                        disabled={
                            userHasReachedMaxApplicationsLimit(
                                applicationLimitations,
                                MAX_APPLICATIONS_BY_USER,
                            ) ||
                            namespaceHasReachedMaxApplicationsLimit(
                                applicationLimitations,
                                MAX_APPLICATIONS_BY_NAMESPACE,
                            )
                        }
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 4v16m8-8H4"
                            ></path>
                        </svg>
                        New container
                    </button>
                </div>
                {loading && <LoadingSpinner />}

                {containers.length == 0 && (
                    <div className="flex h-[50vh] w-4/5 items-center justify-center gap-2 border-2  border-dashed">
                        <Image
                            src="/stuga-logo.png"
                            alt="Description de l'image"
                            width="60"
                            height="60"
                        ></Image>
                        <div className="flex flex-col justify-center overflow-hidden text-sm">
                            <h5 className="text-2xl font-bold text-gray-500 md:text-2xl">
                                No container found, start by creating one ! 🚀
                            </h5>
                            <p className="text-gray-500">
                                Deploy API, web apps, and databases and more
                            </p>
                        </div>
                    </div>
                )}

                {containers && containers.length > 0 && (
                    <div className="flex w-4/5 justify-center">
                        <div className="relative w-full overflow-x-auto text-gray-500 shadow-md sm:rounded-lg">
                            <table className="w-full text-left text-sm text-gray-500">
                                <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            name
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            description
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            image
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            status
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            created at (UTC)
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {containers.map((container) => {
                                        const containerUrl =
                                            getContainerURL(container);
                                        return (
                                            <tr
                                                key={container.id}
                                                className="cursor-pointer border-b bg-gray-100 hover:bg-green-50"
                                                onClick={() => {
                                                    router.push(containerUrl!);
                                                }}
                                            >
                                                <th
                                                    scope="row"
                                                    className="whitespace-nowrap px-6 py-4 font-medium"
                                                >
                                                    {/* <a href={containerUrl}> */}
                                                    {container.name}
                                                    {/* </a> */}
                                                </th>
                                                <td className="px-6 py-4">
                                                    {/* <a href={containerUrl}> */}
                                                    {container.description}
                                                    {/* </a> */}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {/* <a href={containerUrl}> */}
                                                    {container.image}
                                                    {/* </a> */}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {/* <a href={containerUrl}> */}
                                                    {applicationStatusToComponent(
                                                        container.status,
                                                    )}
                                                    {/* </a> */}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {/* <a href={containerUrl}> */}
                                                    {container.createdAt.toLocaleString()}
                                                    {/* </a> */}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
