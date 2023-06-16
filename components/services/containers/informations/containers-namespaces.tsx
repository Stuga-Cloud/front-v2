"use client";
import { Session } from "next-auth";
import { redirect, useRouter } from "next/navigation";
import React, { useState } from "react";
import { Project } from "@/lib/models/project";
import { ContainerApplicationNamespace } from "@/lib/models/containers/container-application-namespace";
import { LoadingSpinner } from "@/components/shared/icons";
import axios from "axios";
import { DisplayToast } from "@/components/shared/toast/display-toast";
import { ContainerNamespaceDropdownAction } from "@/components/services/containers/informations/container-namespace-dropdown-action";
import { ContainerNamespace } from "@/lib/models/containers/prisma/container-namespace";
import Image from "next/image";

export default function ContainersNamespaces({
    session,
    project,
    namespaces,
    namespacesInAPI,
    reloadNamespaces,
}: {
    session: Session;
    project: Project;
    namespaces: ContainerNamespace[];
    namespacesInAPI: ContainerApplicationNamespace[];
    reloadNamespaces: () => void;
}) {
    if (!session) redirect("/");
    if (!project || !namespacesInAPI)
        redirect(`/projects/${project.id}/services/containers`);

    const router = useRouter();
    const [errorFromMessage, setErrorFormMessage] = useState<string | null>(
        null,
    );
    const [loading, setLoading] = useState(false);

    const clickOnNamespace = (
        namespaceInAPI: ContainerApplicationNamespace,
    ) => {
        const correspondingNamespace = namespaces.find(
            (namespace) => namespace.idInAPI === namespaceInAPI.id,
        );
        if (!correspondingNamespace) return;
        router.push(
            `/projects/${project.id}/services/containers/namespaces/${correspondingNamespace.id}`,
        );
    };

    const deleteContainerNamespace = async (
        namespace: ContainerApplicationNamespace,
    ) => {
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
                <div className="mb-2 flex w-4/5 flex-row items-center justify-between">
                    <h2 className="mb-5 w-2/5 text-4xl font-bold"></h2>
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

                {namespacesInAPI && namespacesInAPI.length === 0 && (
                    <div className="flex h-[50vh] w-full items-center justify-center gap-2 border-2  border-dashed">
                        <Image
                            src="/stuga-logo.png"
                            alt="Description de l'image"
                            width="60"
                            height="60"
                        ></Image>
                        <div className="flex h-16 flex-col justify-center overflow-hidden text-sm">
                            <h5 className="text-2xl font-bold text-gray-500 md:text-2xl">
                                No namespace found, start by creating one ! 🚀
                            </h5>
                            <p className="text-gray-500">
                                A namespace is a way to organize your
                                containers. You can create as many namespaces as
                                you want.
                            </p>
                        </div>
                    </div>
                )}
                {namespacesInAPI && namespacesInAPI.length > 0 && (
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
                                    {namespacesInAPI &&
                                        namespacesInAPI.map((namespace) => (
                                            <tr
                                                key={namespace.id}
                                                className="cursor-pointer border-b bg-gray-100 hover:bg-green-50"
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
