"use client";
import { use, useEffect, useState } from "react";
import TabsNamespace from "./tabs-namespace";
import Dashboard from "./dashboard";
import Settings from "./settings";
import { Session } from "next-auth";
import { toastEventEmitter } from "@/lib/event-emitter/toast-event-emitter";
import { LoadingSpinner } from "@/components/shared/icons";
import { useRouter } from "next/navigation";
import { Namespace } from "@/lib/models/registry/namespace";

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
    const [activeTab, setActiveTab] = useState<"dashboard" | "settings">(
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
            <h2 className="mb-5 w-4/5 text-4xl font-bold">
                Container Registry
            </h2>
            {loading ? (
                <div className="flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            ) : (
                <TabsNamespace
                    onClick={(tab: "settings" | "dashboard") => {
                        setActiveTab(tab);
                    }}
                />
            )}
            {!loading && activeTab === "dashboard" ? (
                <Dashboard 
                namespaces={namespaces} 
                onClick={(namespaceId: string) => {
                    console.log("on déclenche le dashboard");
                    router.push(`/projects/${projectId}/services/registry/namespace/${namespaceId}`);
                }}
                />
            ) : activeTab === "settings" ? (
                <Settings />
            ) : null}
        </div>
    );
}
