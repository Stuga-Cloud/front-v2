"use client";
import { useEffect, useState } from "react";
import TabsNamespace from "./tabs-namespace";
import Dashboard from "./dashboard";
import { Session } from "next-auth";
import { toastEventEmitter } from "@/lib/event-emitter/toast-event-emitter";
import { LoadingSpinner } from "@/components/shared/icons";
import { useRouter } from "next/navigation";
import { Namespace } from "@/lib/models/registry/namespace";
import Access from "../detail/access/access";
import Profile from "./profile";

const getNamespaces = async (projectId: string): Promise<Namespace[]> => {
    try {
        const res = await fetch(
            `/api/projects/${projectId}/services/registry`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
        const namespaces: {
            id: string;
            createdAt: string;
            modifiedAt: string;
            name: string;
            registryId: string;
            state: "public" | "private";
        }[] = await res.json();

        return namespaces.map((namespace) => ({
            ...namespace,
        }));
    } catch (error) {
        console.log(error);
        return [];
    }
};

export default function Namespaces({
    session,
    projectId,
}: {
    session: Session;
    projectId: string;
}) {
    const [activeTab, setActiveTab] = useState<"dashboard" | "profile">(
        "dashboard",
    );
    const [namespaces, setNamespaces] = useState<Namespace[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!projectId) return;

        setLoading(true);
        getNamespaces(projectId)
            .then((namespaces) => {
                setNamespaces(namespaces);
            })
            .catch((error) => {
                toastEventEmitter.emit("pop", {
                    type: "danger",
                    message: "error when try to get namespaces",
                    duration: 5000,
                });
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div className="z-10 flex w-full flex-col items-center justify-center">
            <div className="flex w-4/5 flex-row items-center justify-between">
                <h2 className="mb-5 w-4/5 text-4xl font-bold">
                    Container Registry
                </h2>
                <button
                    className="Button stuga-primary-color cursor-pointer"
                    onClick={() => {
                        router.push(
                            `/projects/${projectId}/services/registry/new`,
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
            {loading ? (
                <div className="flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            ) : (
                <TabsNamespace
                    onClick={(tab: "profile" | "dashboard") => {
                        setActiveTab(tab);
                    }}
                    tabsHidden={[]}
                />
            )}
            {!loading && activeTab === "dashboard" ? (
                <Dashboard
                    namespaces={namespaces}
                    onClick={(namespaceId: string) => {
                        router.push(
                            `/projects/${projectId}/services/registry/namespace/${namespaceId}`,
                        );
                    }}
                />
            ) : !loading && activeTab === "profile" ? (
                <Profile session={session} projectId={projectId} />
            ): null}
        </div>
    );
}
