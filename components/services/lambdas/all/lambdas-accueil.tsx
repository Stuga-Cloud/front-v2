"use client";
import { toastEventEmitter } from "@/lib/event-emitter/toast-event-emitter";
import { GetLambdas } from "@/lib/services/lambdas/client/get-lambdas";
import { Lambda } from "@prisma/client";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import TabsLambdas from "./tabs-lambda";
import { LoadingSpinner } from "@/components/shared/icons";
import { useRouter } from "next/navigation";
import LambdasDashboard from './lambdas-dashboard';
import LambdaMonitor from './lambdas-monitor';
import { DisplayToast } from '@/components/shared/toast/display-toast';

export default function LambdaAccueil({
    session,
    projectId,
}: {
    session: Session;
    projectId: string;
}) {
    const [loading, setLoading] = useState(true);
    const [lambdas, setLambdas] = useState<Lambda[]>([]);
    const [activeTab, setActiveTab] = useState<"dashboard" | "monitor">(
        "dashboard",
    );
    const router = useRouter();

    useEffect(() => {
        if (!projectId) return;

        setLoading(true);
        GetLambdas(projectId)
            .then((lambdas) => {
                setLambdas(lambdas);
            })
            .catch((error) => {
                console.log("error")
                // toastEventEmitter.emit("pop", {
                //     type: "danger",
                //     message: "error when try to get lambdas",
                //     duration: 5000,
                // });
                DisplayToast({
                    type: "error",
                    message: "error when try to get lambdas",
                    duration: 4000,
                });
            })
            .finally(() => {
                console.log("finally")
                setLoading(false);
            });
    }, []);
    return (
        <div className="z-10 flex w-full flex-col items-center justify-center">
            <div className="flex w-4/5 flex-row items-center justify-between">
                <h2 className="mb-5 w-4/5 text-4xl font-bold">
                    Lambdas
                </h2>
                <button
                    className="Button stuga-primary-color cursor-pointer"
                    onClick={() => {
                        router.push(
                            `/projects/${projectId}/services/lambdas/new`,
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
                    New Lambda
                </button>
            </div>
            {loading ? (
                <div className="flex items-center justify-center">
                    <LoadingSpinner size="large" />
                </div>
            ) : (
                <TabsLambdas
                    onClick={(tab: "dashboard") => {
                        setActiveTab(tab);
                    }}
                    tabsHidden={[]}
                />
            )}
            {!loading && activeTab === "dashboard" ? (
                <LambdasDashboard
                    projectId={projectId}
                    lambdas={lambdas}
                    onClick={(lambda: Lambda) => {
                        router.push(
                            `/projects/${projectId}/services/lambdas/${lambda.id}`,
                        );
                    }}
                    afterDelete={async () => {
                        try {
                            console.log("after delete set lambdas")
                            const lambdas = await GetLambdas(projectId);
                            console.log("lambdas")
                            setLambdas(lambdas);
                        } catch (error) {
                            // toastEventEmitter.emit("pop", {
                            //     type: "danger",
                            //     message: "error when try to get lambdas",
                            //     duration: 5000,
                            // });
                            DisplayToast({
                                type: "error",
                                message: "error when try to get lambdas",
                                duration: 4000,
                            });
                        }
                    }}
                />
            // ) : !loading && activeTab === "monitor" ? (
            //     <LambdaMonitor projectId={projectId} />
            ) : null}
        </div>
    );
}
