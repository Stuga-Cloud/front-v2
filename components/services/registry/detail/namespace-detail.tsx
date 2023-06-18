"use client";
import { useEffect, useState } from "react";
import { Session } from "next-auth";
import { LoadingSpinner } from "@/components/shared/icons";
import { useRouter } from "next/navigation";
import { Namespace } from "@/lib/models/registry/namespace";
import DetailDashboard from "./detail-dashboard";
import Settings from "./settings";
import TabsImages from "./tabs-images";
import Access from "./access/access";
import axios from "axios";
import { DisplayToast } from "@/components/shared/toast/display-toast";

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
    const res = await axios.get(`/api/registry/namespace/${namespaceId}`, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    const namespaceWithInfos: NamespaceWithImageInformationsResponse =
        await res.data;
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
                console.log("Found namespace in registry detail", namespaces);
                setNamespaceWithInfo(namespaces);
            })
            .catch((error) => {
                console.log(
                    "Could not get namespace in registry detail",
                    error,
                );
                DisplayToast({
                    type: "error",
                    message:
                        "Could not get namespace, please try again later or contact support",
                    duration: 5000,
                });
            })
            .finally(() => {
                setLoading(false);
            });
    }, [namespaceId]);

    return (
        <div className="z-10 flex w-full flex-col items-center justify-center">
            <>
                <h2 className="mb-5 w-4/5 text-4xl font-bold">
                    Namespace {namespaceWithInfo?.namespace.name}
                </h2>

                <TabsImages
                    onClick={(tab: "settings" | "dashboard" | "access") => {
                        setActiveTab(tab);
                    }}
                />
            </>
            {loading && (
                <div className="flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            )}
            {!loading && activeTab === "dashboard" ? (
                namespaceWithInfo && (
                    <DetailDashboard
                        projectId={projectId}
                        namespace={namespaceWithInfo.namespace}
                        images={namespaceWithInfo.images}
                        onClick={(namespaceId: string) => {}}
                        setLoading={setLoading}
                        afterDelete={async () => {
                            try {
                                const namespaceWithInfo = await getNamespace(
                                    namespaceId,
                                );
                                setNamespaceWithInfo(namespaceWithInfo);
                            } catch (error) {
                                DisplayToast({
                                    type: "error",
                                    message:
                                        "Could not get namespace, please try again later or contact support",
                                    duration: 5000,
                                });
                            }
                        }}
                    />
                )
            ) : activeTab === "settings" ? (
                <Settings session={session} namespace={namespaceWithInfo!} />
            ) : activeTab === "access" ? (
                <Access
                    isPrivateNamesapce={
                        namespaceWithInfo?.namespace.state === "private"
                    }
                    session={session}
                    namespace={namespaceWithInfo?.namespace!}
                    projectId={projectId}
                />
            ) : null}
        </div>
    );
}
