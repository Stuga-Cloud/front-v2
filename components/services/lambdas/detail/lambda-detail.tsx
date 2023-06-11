"use client";
import { toastEventEmitter } from "@/lib/event-emitter/toast-event-emitter";
import { GetLambdaById } from "@/lib/services/lambdas/client/get-lambda-by-id";
import { Lambda } from "@prisma/client";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import LambdaNameForm from "../create/lambda-name-form";
import { isLambdaNameValid } from "@/lib/models/lambdas/validation/lambda-create-candidate";
import LambdaImageForm, {
    AvailableRegistriesInformation,
} from "../create/lambda-image-form";
import LambdaScalabilityForm from "../create/lambda-scalability-form";
import LambdaSettingsForm from "../create/lambda-settings-form";
import { cp } from "fs";
import {
    cpuLimitsChoices,
    memoryLimitsChoices,
} from "../../../../lib/models/lambdas/config/lambda-create-config";
import {
    LambdaCPULimit,
    LambdaMemoryLimit,
} from "@/lib/models/lambdas/lambda-create";
import { LoadingSpinner } from "@/components/shared/icons";
import TabsLambdaDetail from "./tabs-lambda-detail";
import LambdaInformation from "./lambda-information";
import LambdaEnvVarForm from "../create/lambda-env-var";
import LambdaConfidentialityForm from "../create/lambda-confidentiality-form";

export default function LambdaDetail({
    session,
    lambdaId,
    projectId,
}: {
    session: Session;
    lambdaId: string;
    projectId: string;
}) {
    const [activeTab, setActiveTab] = useState<
        "details" | "environments" | "visibility" | "monitor"
    >("details");
    const [lambda, setLambda] = useState<Lambda>();
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!lambdaId) return;

        setLoading(true);
        GetLambdaById(projectId, lambdaId)
            .then((lambda) => {
                setLambda(lambda);
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
    }, [lambdaId, projectId]);

    return (
        <>
            <div className="z-10 flex w-full flex-col items-center justify-center">
                <div className="flex w-4/5 flex-row items-center justify-between">
                    <h2 className="mb-5 w-4/5 text-4xl font-bold">
                        {lambda?.name}
                    </h2>
                </div>
                {loading ? (
                    <div className="flex items-center justify-center">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <TabsLambdaDetail
                        onClick={(
                            tab:
                                | "details"
                                | "environments"
                                | "visibility"
                                | "monitor",
                        ) => {
                            setActiveTab(tab);
                        }}
                    />
                )}
                {!loading && lambda && activeTab === "details" && (
                    <LambdaInformation lambda={lambda} setLambda={setLambda} />
                )}
                {!loading && lambda && activeTab === "environments" && (
                    <LambdaEnvVarForm
                        variables={[]}
                        handleAddEnvironmentVariable={() => {
                            const newEnvironmentVariables = [
                                ...applicationEnvironmentVariables,
                            ];
                            newEnvironmentVariables.push({
                                name: "",
                                value: "",
                            });
                            setApplicationEnvironmentVariables(
                                newEnvironmentVariables,
                            );
                            console.log(applicationEnvironmentVariables);
                        }}
                        handleRemoveEnvironmentVariable={(index: number) => {
                            const newEnvironmentVariables = [
                                ...applicationEnvironmentVariables,
                            ];
                            newEnvironmentVariables.splice(index, 1);
                            setApplicationEnvironmentVariables(
                                newEnvironmentVariables,
                            );
                        }}
                        handleEnvironmentVariableChange={(
                            index: number,
                            whereToChange: "name" | "value",
                            value: string,
                        ) => {
                            const newEnvironmentVariables = [
                                ...applicationEnvironmentVariables,
                            ];
                            newEnvironmentVariables[index][whereToChange] =
                                value;
                            setApplicationEnvironmentVariables(
                                newEnvironmentVariables,
                            );
                        }}
                    />
                )}
                {!loading && lambda && activeTab === "visibility" && (
                    <LambdaConfidentialityForm
                        value={confidentiality}
                        handleVisibilityChange={(
                            value: LambdaVisibility,
                        ) => {
                            setConfidentiality(value);
                        }}
                />
            </div>
        </>
    );
}
