"use client";
import { Session } from "next-auth";
import React, { useEffect, useState } from "react";
import LoadingSpinner from "@/components/shared/icons/loading-spinner";
import { toastEventEmitter } from "@/lib/event-emitter/toast-event-emitter";
import { useRouter } from "next/navigation";
import { Project } from "@/lib/models/project";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { StugaError } from "@/lib/services/error/error";
import { CreateContainerNamespaceBody } from "@/lib/services/containers/namespaces/create-container-namespace.body";
import { DisplayToast } from "@/components/shared/toast/display-toast";

export default function NewNamespaceForm({
    session,
    projectId,
}: {
    session: Session | null;
    projectId: string;
}) {
    const user = session?.user;

    const [loading, setLoading] = useState(false);
    const [project, setProject] = useState({} as Project);
    const [namespace, setNamespace] = useState<string | undefined>(undefined);
    const [description, setDescription] = useState<string | undefined>(
        undefined,
    );

    const router = useRouter();

    const getProject = async (projectId: string) => {
        try {
            const result = await axios.get(`/api/projects/${projectId}`);
            return result.data;
        } catch (error: any) {
            console.log(error);
            if (error.response.status === 404) {
                throw new Error("Project not found");
            }
        }
    };

    useEffect(() => {
        if (!projectId) return;
        setLoading(true);
        getProject(projectId)
            .then((project) => {
                setProject(project);
                setLoading(false);
            })
            .catch((error) => {
                toastEventEmitter.emit("pop", {
                    type: "danger",
                    message:
                        "Could not find project, please try again later or contact us",
                    duration: 4000,
                });
                console.error(
                    "error when try to get project in new namespace form",
                    error,
                );
                setLoading(false);
                router.push(`/projects`);
            });
    }, [projectId, router]);

    const namespaceUpdated = (e: any) => {
        setNamespace(e.target.value);
    };

    const stringInSubdomainRegex = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/;
    const isNamespaceValid = (namespace: string | undefined): boolean => {
        return (
            namespace == undefined ||
            (namespace.length > 3 && stringInSubdomainRegex.test(namespace))
        );
    };

    const handleKeyDown = (event: any) => {
        if (event.key === "Enter") {
            event.preventDefault();
        }
    };
    const handleSubmit = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        try {
            if (!namespace) {
                DisplayToast({
                    type: "error",
                    message: "Please fill at least the namespace field",
                    duration: 3000,
                });
                return;
            }
            setLoading(true);
            const createContainerApplicationBody: CreateContainerNamespaceBody =
                {
                    name: namespace,
                    description: description,
                    userId: (user! as any).id!,
                };
            await axios.post(
                `/api/projects/${projectId}/services/containers/namespaces`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    data: createContainerApplicationBody,
                },
            );
            DisplayToast({
                type: "success",
                message: `Namespace ${namespace} created successfully`,
                duration: 4000,
            });
            setLoading(false);
            router.push(`/projects/${projectId}/services/containers`);
        } catch (error: any) {
            setLoading(false);
            console.log("Error while creating namespace", error);

            if (error.response.status === 409) {
                DisplayToast({
                    type: "error",
                    message: `Namespace ${namespace} already exists, please choose another name`,
                    duration: 4000,
                });
                return;
            }

            if (error instanceof StugaError) {
                toastEventEmitter.emit("pop", {
                    type: "danger",
                    message: error.message,
                    duration: 4000,
                });
            }
            toastEventEmitter.emit("pop", {
                type: "danger",
                message:
                    "Couldn't create namespace, try again or contact support",
                duration: 4000,
            });
        }
    };

    return (
        <>
            <div className="z-10 flex w-full flex-col items-center justify-center px-5">
                {/* Change interline with more space */}
                <h1 className="mb-2 text-center text-3xl font-extrabold leading-loose leading-relaxed tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
                    Create a{" "}
                    <mark className="rounded bg-green-400 px-2 leading-relaxed text-white">
                        namespace
                    </mark>{" "}
                    in{" "}
                    <mark className="rounded bg-green-400 px-2 leading-relaxed text-white">
                        {project.name}
                    </mark>{" "}
                    to scope your applications
                </h1>

                <p
                    className="text-l lg:text-l pb-5 font-normal text-gray-500"
                    id="step-name"
                >
                    Deploy your applications, databases, and services in our
                    cloud in a few clicks.
                </p>
                {loading && <LoadingSpinner />}
                <form
                    onSubmit={handleSubmit}
                    onKeyDown={handleKeyDown}
                    className="flex w-11/12 flex-col py-10"
                >
                    {/* Place stepper information on left side and form on right side */}
                    <div className="flex w-full flex-row items-start align-middle">
                        {/* Form */}
                        <div className="flex w-full flex-col px-5">
                            <div className="mb-10 ms-5 flex h-96 w-full flex-col">
                                <div className="mb-6 ms-5 flex flex-col">
                                    <div className="mb-2 flex flex-col">
                                        <label
                                            htmlFor="namespace"
                                            className={
                                                `pb-1 text-sm font-medium text-gray-700` +
                                                (!isNamespaceValid(namespace)
                                                    ? "gray-900"
                                                    : "red-700")
                                            }
                                        >
                                            Namespace name
                                        </label>
                                        <input
                                            className={`bg-gray-40 mb-2 block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 ${
                                                !isNamespaceValid(namespace)
                                                    ? "border-red-500 bg-red-50 p-2.5 text-sm text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500"
                                                    : ""
                                            }`}
                                            id="namespace"
                                            name="namespace"
                                            type="text"
                                            value={namespace || ""}
                                            onChange={(e) => {
                                                namespaceUpdated(e);
                                            }}
                                            placeholder="my-first-namespace"
                                            required
                                        />
                                        {!isNamespaceValid(namespace) && (
                                            <p className="text-sm text-red-500">
                                                Please enter a valid namespace.
                                                Follow the instructions below.
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex flex-row items-center gap-2">
                                        <InfoCircledIcon />
                                        <p className="text-sm font-semibold text-gray-500">
                                            The namespace can only contain
                                            alphanumeric characters and hyphens,
                                            it must be at least 3 characters
                                            long and cannot start or end with a
                                            hyphen.
                                        </p>
                                    </div>
                                </div>
                                <div className="mb-2 ms-5 flex flex-col">
                                    <label
                                        htmlFor="description"
                                        className="pb-1 text-sm font-medium text-gray-700"
                                    >
                                        Description
                                    </label>
                                    <textarea
                                        className="bg-gray-40 mb-2 block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500"
                                        value={description || ""}
                                        onChange={(e) => {
                                            setDescription(e.target.value);
                                        }}
                                        placeholder="A namespace to deploy my applications"
                                    />
                                    <div className="flex flex-row items-center gap-2">
                                        <InfoCircledIcon />
                                        <p className="text-sm font-semibold text-gray-500">
                                            The description is optional but
                                            recommended. It will help you to
                                            remember what this namespace is for.
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6 flex flex-col items-center justify-center ">
                                    <button
                                        type="submit"
                                        className="Button stuga-primary-color"
                                        disabled={
                                            !isNamespaceValid(namespace) ||
                                            loading
                                        }
                                    >
                                        Create namespace
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}
