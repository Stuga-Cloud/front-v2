"use client";
import { Session } from "next-auth";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { Project } from "@/lib/models/project";
import { ContainerNamespace } from "@/lib/models/containers/container-namespace";
import { LoadingSpinner } from "@/components/shared/icons";
import axios from "axios";
import { DisplayToast } from "@/components/shared/toast/display-toast";
import { ContainerNamespaceDropdownAction } from "@/components/services/containers/informations/container-namespace-dropdown-action";

export default function ContainersNamespaces({
    session,
    project,
    namespaces,
    reloadNamespaces,
}: {
    session: Session;
    project: Project;
    namespaces: ContainerNamespace[];
    reloadNamespaces: () => void;
}) {
    if (!session) redirect("/");
    if (!project || !namespaces)
        redirect(`/projects/${project.id}/services/containers`);

    const router = useRouter();
    const [errorFromMessage, setErrorFormMessage] = useState<string | null>(
        null,
    );
    const [loading, setLoading] = useState(false);

    const [activeTab, setActiveTab] = useState<
        "image" | "details" | "environments" | "visibility" | "monitor"
    >("details");

    const clickOnNamespace = (namespace: ContainerNamespace) => {
        router.push(
            `/projects/${project.id}/services/containers/namespaces/${namespace.id}`,
        );
    };

    const deleteContainerNamespace = async (namespace: ContainerNamespace) => {
        setLoading(true);
        try {
            const res = await axios.delete(
                `/api/projects/${project.id}/services/containers/namespaces/${namespace.id}`,
            );
            if (res.status === 200) {
                DisplayToast({
                    type: "success",
                    message: "Namespace deleted",
                    duration: 3000,
                });
                setLoading(false);
                reloadNamespaces();
            } else {
                console.log("error when try to delete namespace", res);
                DisplayToast({
                    type: "error",
                    message:
                        "Could not delete namespace, please try again later or contact support",
                    duration: 7000,
                });
                setLoading(false);
            }
        } catch (error: any) {
            setLoading(false);
            console.log("error when try to delete namespace", error);
            DisplayToast({
                type: "error",
                message:
                    "Could not delete namespace, please try again later or contact support",
                duration: 7000,
            });
        }
    };

    return (
        <>
            <div className="z-10 flex w-full flex-col items-center justify-center">
                <div className="flex w-4/5 flex-row items-center justify-between">
                    <h2 className="mb-5 w-4/5 text-4xl font-bold">
                        Namespaces
                    </h2>
                    <button
                        className="Button stuga-primary-color cursor-pointer"
                        onClick={() => {
                            router.push(
                                `/projects/${project.id}/services/containers/namespaces/new`,
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
                        New namespace
                    </button>
                </div>
                {loading && <LoadingSpinner />}

                {namespaces && namespaces.length === 0 && (
                    <div className="flex h-[50vh] items-center justify-center">
                        <p className="text-gray-500">
                            No namespace found, start by creating one ! 🚀
                        </p>
                    </div>
                )}
                {namespaces && namespaces.length > 0 && (
                    <div className="flex w-4/5 justify-center">
                        <div className="w-full text-gray-500 shadow-md dark:text-gray-400 sm:rounded-lg">
                            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                                <thead className="bg-gray-50 text-xs uppercase text-gray-700  dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            name
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            description
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            created at (UTC)
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            <span className="sr-only">
                                                Actions
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {namespaces &&
                                        namespaces.map((namespace) => (
                                            <tr
                                                key={namespace.id}
                                                className="cursor-pointer border-b  bg-gray-100  hover:bg-gray-50 dark:border-gray-200 dark:hover:bg-gray-200"
                                            >
                                                <th
                                                    scope="row"
                                                    className="whitespace-nowrap px-6 py-4 font-medium"
                                                    onClick={() => {
                                                        clickOnNamespace(
                                                            namespace,
                                                        );
                                                    }}
                                                >
                                                    {namespace.name}
                                                </th>
                                                <td
                                                    className="px-6 py-4"
                                                    onClick={() => {
                                                        clickOnNamespace(
                                                            namespace,
                                                        );
                                                    }}
                                                >
                                                    {namespace.description}
                                                </td>
                                                <td
                                                    className="px-6 py-4"
                                                    onClick={() => {
                                                        clickOnNamespace(
                                                            namespace,
                                                        );
                                                    }}
                                                >
                                                    {namespace.createdAt.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {/*<a*/}
                                                    {/*    href="#"*/}
                                                    {/*    className="font-medium text-blue-600 hover:underline dark:text-blue-500"*/}
                                                    {/*    onClick={(e) => {*/}
                                                    {/*        e.preventDefault();*/}
                                                    {/*        console.log(*/}
                                                    {/*            "je déclenche l'action",*/}
                                                    {/*        );*/}
                                                    {/*    }}*/}
                                                    {/*>*/}
                                                    <ContainerNamespaceDropdownAction
                                                        messagePopup="Are you sure you want to delete this namespace?"
                                                        deleteAction={async () =>
                                                            await deleteContainerNamespace(
                                                                namespace,
                                                            )
                                                        }
                                                    />
                                                    {/*</a>*/}
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
