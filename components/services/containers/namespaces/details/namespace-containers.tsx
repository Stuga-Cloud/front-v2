"use client";
import { Session } from "next-auth";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { Project } from "@/lib/models/project";
import { LoadingSpinner } from "@/components/shared/icons";
import { ContainerApplication } from "@/lib/models/containers/container-application";
import axios from "axios";
import { DisplayToast } from "@/components/shared/toast/display-toast";
import { ContainerNamespace } from "@/lib/models/containers/prisma/container-namespace";
import { ContainerApplicationNamespace } from "@/lib/models/containers/container-application-namespace";
import { applicationStatusToComponent } from "@/lib/services/containers/application-status-to-component";

export default function NamespaceContainers({
    session,
    project,
    namespace,
    namespaceInAPI,
    containers,
    reloadContainers,
}: {
    session: Session;
    project: Project;
    namespace: ContainerNamespace;
    namespaceInAPI: ContainerApplicationNamespace;
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

    const clickOnContainer = (container: ContainerApplication) => {
        router.push(
            `/projects/${project.id}/services/containers/namespaces/${namespace.id}/applications/${container.id}`,
        );
    };

    const deleteContainer = async (container: ContainerApplication) => {
        setLoading(true);
        try {
            const res = await axios.delete(`/api/containers/${container.id}`);
            if (res.status !== 200) {
                DisplayToast({
                    type: "error",
                    message:
                        "Could not delete container, please try again later or contact support",
                    duration: 3000,
                });
                setLoading(false);
                return;
            }
            reloadContainers();
            setLoading(false);
        } catch (error) {
            DisplayToast({
                type: "error",
                message:
                    "Could not delete container, please try again later or contact support",
                duration: 3000,
            });
            setLoading(false);
        }
    };

    return (
        <>
            <div className="z-10 flex w-full flex-col items-center justify-center">
                <div className="mb-4 flex w-4/5 flex-row items-center justify-between">
                    <h2 className="mb-5 w-2/5 text-4xl font-bold"></h2>
                    <button
                        className="Button stuga-primary-color cursor-pointer"
                        onClick={() => {
                            router.push(
                                `/projects/${project.id}/services/containers/namespaces/${namespace.id}/applications/new`,
                            );
                        }}
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

                {containers && containers.length === 0 && (
                    <div className="flex h-[50vh] items-center justify-center">
                        <p className="text-gray-500">
                            No container found, start by creating one ! 🚀
                        </p>
                    </div>
                )}
                {containers && containers.length > 0 && (
                    <div className="flex w-4/5 justify-center">
                        <div className="w-full text-gray-500 shadow-md dark:text-gray-400 sm:rounded-lg">
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
                                    {containers &&
                                        containers.map((container) => (
                                            <tr
                                                key={container.id}
                                                className="cursor-pointer border-b bg-gray-100 hover:bg-green-50"
                                            >
                                                <th
                                                    scope="row"
                                                    className="whitespace-nowrap px-6 py-4 font-medium"
                                                    onClick={() => {
                                                        clickOnContainer(
                                                            container,
                                                        );
                                                    }}
                                                >
                                                    {container.name}
                                                </th>
                                                <td
                                                    className="px-6 py-4"
                                                    onClick={() => {
                                                        clickOnContainer(
                                                            container,
                                                        );
                                                    }}
                                                >
                                                    {container.description}
                                                </td>
                                                <td
                                                    className="px-6 py-4"
                                                    onClick={() => {
                                                        clickOnContainer(
                                                            container,
                                                        );
                                                    }}
                                                >
                                                    {container.image}
                                                </td>
                                                <td
                                                    className="px-6 py-4"
                                                    onClick={() => {
                                                        clickOnContainer(
                                                            container,
                                                        );
                                                    }}
                                                >
                                                    {applicationStatusToComponent(
                                                        container.status,
                                                    )}
                                                </td>
                                                <td
                                                    className="px-6 py-4"
                                                    onClick={() => {
                                                        clickOnContainer(
                                                            container,
                                                        );
                                                    }}
                                                >
                                                    {container.createdAt.toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
