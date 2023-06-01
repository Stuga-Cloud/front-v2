"use client";
import { use, useEffect, useState } from "react";
import TabsNamespace from "./tabs-namespace";
import Dashboard from "./dashboard";
import Settings from "./settings";
import { Session } from "next-auth";
import { toastEventEmitter } from "@/lib/event-emitter/toast-event-emitter";
import { LoadingSpinner } from "@/components/shared/icons";

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
    const [namespaces, setNamespaces] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!projectId) return;

        setLoading(true);
        fetch(`/api/projects/${projectId}/services/registry`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((res) => {
                console.log("result");
                console.log(res);
                setNamespaces(res);
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
                <Dashboard />
            ) : activeTab === "settings" ? (
                <Settings />
            ) : null}
        </div>
    );
}
