import { Session } from "next-auth";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/shared/icons/loading-spinner";
import axios from "axios";
import { toastEventEmitter } from "@/lib/event-emitter/toast-event-emitter";
import { Namespace } from "@/lib/models/registry/namespace";
import { GetAccountInNamespace } from "../../services/get-account-in-namespace";
import { CodeBlock, nord } from "react-code-blocks";
import CopyToClipboard from "react-copy-to-clipboard";
import DockerLoginCode from "../docker-login-code";
import { AddAccountInNamespace } from "../../services/add-account-in-namespace";
import { StugaError } from "@/lib/services/error/error";
export default function Access({
    session,
    namespace,
    projectId,
}: {
    session: Session;
    namespace: Namespace;
    projectId: string;
}) {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<{ userId: number; username: string }>();
    const [code, setCode] = useState("");

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await AddAccountInNamespace(projectId, namespace.id);
            toastEventEmitter.emit("pop", {
                type: "success",
                message: "User added successfully",
                duration: 2000,
            });
            GetAccountInNamespace(namespace.id)
                .then((userReq) => {
                    if (userReq) {
                        setUser(userReq);
                        setCode(
                            "docker login -u " +
                                userReq.username +
                                " " +
                                process.env.NEXT_PUBLIC_BASE_REGISTRY_ENDPOINT +
                                "/" +
                                namespace.name,
                        );
                    }
                })
                .catch((error) => {
                    if (error.response.status === 500) {
                        toastEventEmitter.emit("pop", {
                            type: "danger",
                            message: "Error while fetching user",
                            duration: 2000,
                        });
                    }

                    if (
                        error.response.status === 403 &&
                        error.response.data.error === "user-not-in-namespace"
                    ) {
                        toastEventEmitter.emit("pop", {
                            type: "danger",
                            message: "the user in not in the namespace",
                            duration: 2000,
                        });
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        } catch (error) {
            if (error instanceof StugaError) {
                if (error.status === 404) {
                    toastEventEmitter.emit("pop", {
                        type: "danger",
                        message: "namespace does not exist",
                        duration: 2000,
                    });
                }
            } else {
                toastEventEmitter.emit("pop", {
                    type: "danger",
                    message: "Error while adding user to a namespace",
                    duration: 2000,
                });
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        GetAccountInNamespace(namespace.id)
            .then((userReq) => {
                if (userReq) {
                    console.log(userReq);
                    setUser(userReq);
                    setCode(
                        "docker login -u " +
                            userReq.username +
                            " " +
                            process.env.NEXT_PUBLIC_BASE_REGISTRY_ENDPOINT +
                            "/" +
                            namespace.name,
                    );
                }
            })
            .catch((error) => {
                if (error.response.status === 500) {
                    toastEventEmitter.emit("pop", {
                        type: "warning",
                        message: "Error while fetching user",
                        duration: 2000,
                    });
                }

                if (
                    error.response.status !== 403 &&
                    error.response.data.error !== "user-not-in-namespace"
                ) {
                    toastEventEmitter.emit("pop", {
                        type: "danger",
                        message: "Internal server error",
                        duration: 3000,
                    });
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, [namespace]);

    return (
        <div className="flex w-4/5 flex-col justify-start">
            {!loading && user ? (
                <>
                    <div
                        className="mb-4 flex rounded-lg border border-blue-300 bg-blue-50 p-4 text-sm text-blue-800 dark:border-blue-800 dark:bg-gray-800 dark:text-blue-400"
                        role="alert"
                    >
                        <svg
                            aria-hidden="true"
                            className="mr-3 inline h-5 w-5 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                        <span className="sr-only">Info</span>
                        <div>
                            <span className="font-medium">INFO</span> You have
                            access to this registry
                        </div>
                    </div>
                    <div>
                        <h3 className="mb-5 mt-10 w-4/5 text-3xl font-bold">
                            Authenticate to the namespace
                        </h3>
                    </div>
                    <DockerLoginCode code={code} />

                    <div>
                        <h3 className="mb-5 mt-10 w-4/5 text-3xl font-bold">
                            Push an image to the registry
                        </h3>
                    </div>
                    <div className="mb-5">
                        <DockerLoginCode
                            code={"docker pull hello-world:latest"}
                        />
                    </div>
                    <div className="mb-5">
                        <DockerLoginCode
                            code={
                                "docker tag hello-world:latest " +
                                process.env.NEXT_PUBLIC_BASE_REGISTRY_ENDPOINT +
                                "/" +
                                namespace.name +
                                "/hello-world:latest"
                            }
                        />
                    </div>
                    <div className="mb-5">
                        <DockerLoginCode
                            code={
                                "docker push " +
                                process.env.NEXT_PUBLIC_BASE_REGISTRY_ENDPOINT +
                                "/" +
                                namespace.name +
                                "/hello-world:latest"
                            }
                        />
                    </div>
                </>
            ) : null}
            {loading ? (
                <div className="flex h-[50vh] items-center justify-center">
                    <LoadingSpinner />
                </div>
            ) : !loading && !user ? (
                <>
                    <h2 className="mb-5 mt-10 w-4/5 text-3xl font-bold">
                        Initialize your access to the namespace
                    </h2>
                    <div
                        className="mb-4 flex rounded-lg border border-blue-300 bg-blue-50 p-4 text-sm text-blue-800 dark:border-blue-800 dark:bg-gray-800 dark:text-blue-400"
                        role="alert"
                    >
                        <svg
                            aria-hidden="true"
                            className="mr-3 inline h-5 w-5 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                        <span className="sr-only">Info</span>
                        <div>
                            <span className="font-medium">INFO</span> You do not
                            yet have an account in the registry. Start by
                            creating your account.
                        </div>
                    </div>
                    <div className="ms-5 flex w-4/5 items-center ">
                        <button
                            type="submit"
                            className="focus:shadow-outline w-full rounded-lg bg-green-700 px-3 py-2 text-white shadow-sm hover:bg-green-800 focus:outline-none"
                            onClick={handleSubmit}
                        >
                            Create it
                        </button>
                    </div>
                </>
            ) : null}
        </div>
    );
}
