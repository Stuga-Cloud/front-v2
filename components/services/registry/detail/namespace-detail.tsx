"use client";
import { use, useEffect, useState } from "react";
import Dashboard from "./namespace-detail";
import { Session } from "next-auth";
import { toastEventEmitter } from "@/lib/event-emitter/toast-event-emitter";
import { LoadingSpinner } from "@/components/shared/icons";
import { useRouter } from "next/navigation";
import { Namespace } from "@/lib/models/registry/namespace";
import DetailDashboard from "./detail-dashboard";
import Settings from "./settings";
import TabsImages from "./tabs-images";
import Access from "./access/access";

export interface Image {
    digest: string;
    size: number;
    creationTime: string;
    name: string;
    pullCount: number;
    updateTime: string;
    tag: string;
}

export interface NamespaceWithImageInformationsResponse {
    namespace: Namespace;
    images: Image[];
}

const getNamespace = async (
    namespaceId: string,
): Promise<NamespaceWithImageInformationsResponse> => {
    const res = await fetch(`/api/registry/namespace/${namespaceId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const namespaceWithInfos: NamespaceWithImageInformationsResponse =
        await res.json();
    return namespaceWithInfos;
};

export default function NamespaceDetail({
    session,
    namespaceId,
    projectId,
}: {
    session: Session;
    namespaceId: string;
    projectId: string;
}) {
    const [activeTab, setActiveTab] = useState<
        "dashboard" | "settings" | "access"
    >("dashboard");
    const [namespaceWithInfo, setNamespaceWithInfo] =
        useState<NamespaceWithImageInformationsResponse>();
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!namespaceId) return;

        setLoading(true);
        getNamespace(namespaceId)
            .then((namespaces) => {
                setNamespaceWithInfo(namespaces);
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
    }, [namespaceId]);

    return (
        <div className="z-10 flex w-full flex-col items-center justify-center">
            {loading ? (
                <div className="flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            ) : (
                <>
                    <h2 className="mb-5 w-4/5 text-4xl font-bold">
                        Namespace {namespaceWithInfo?.namespace.name}
                    </h2>

                    <TabsImages
                        onClick={(tab: "settings" | "dashboard" | "access") => {
                            setActiveTab(tab);
                        }}
                        accessDisplay={
                            namespaceWithInfo?.namespace.state === "private"
                        }
                    />
                </>
            )}
            {!loading && activeTab === "dashboard" ? (
                namespaceWithInfo && (
                    <DetailDashboard
                        images={namespaceWithInfo.images}
                        onClick={(namespaceId: string) => {}}
                    />
                )
            ) : activeTab === "settings" ? (
                <Settings session={session} namespace={namespaceWithInfo!} />
            ) : namespaceWithInfo?.namespace.state === "private" &&
              activeTab === "access" ? (
                <Access
                    session={session}
                    namespace={namespaceWithInfo?.namespace!}
                    projectId={projectId}
                />
            ) : null}
        </div>
    );
}
