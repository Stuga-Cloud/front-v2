"use client";
import { toastEventEmitter } from "@/lib/event-emitter/toast-event-emitter";
import { GetLambdaById } from "@/lib/services/lambdas/client/get-lambda-by-id";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/shared/icons";
import TabsLambdaDetail from "./tabs-lambda-detail";
import LambdaInformation from "./lambda-information";

import { LambdaModel } from "@/lib/models/lambdas/lambda";
import { LambdaVisibility } from "@/lib/models/lambdas/lambda-create";
import { AvailableRegistriesInformation } from "../create/lambda-image-form";
import LambdaImageUpdate from "./lambda-image-update";
import { lambdaModelEnvToLambdaEnvironment } from "../utils/lambda-env-var-mapper";
import LambdaConfidentialityUpdate from "./lambda-confidentiaity-update";
import {
    AvailableRegistriesToRegistry,
    LambdaRegistryToAvailableRegistriesInformation,
} from "../utils/lambda-registry-mapper";
import LambdaEnvVarForm from "../create/lambda-env-var";
import { UpdateLambda } from "@/lib/services/lambdas/client/update-lambda";
import { UpdateDeployLambda } from "@/lib/services/lambdas/client/update-deploy-lambda";
import { throwIfLambdaCreationCandidateIsNotValid } from "@/lib/models/lambdas/validation/lambda-create-candidate";
import { LambdaMetrics } from "../../../../lib/services/lambdas/lambda-metrics";
import { GetLambdaMetrics } from "@/lib/services/lambdas/client/get-lambda-metrics";
import LambdaMonitor from "./lambda-monitor";
import { Lambda } from "@prisma/client";

export default function LambdaDetail({
    session,
    lambdaId,
    projectId,
}: {
    session: Session;
    lambdaId: string;
    projectId: string;
}) {
    const [lambdaInit, setLambdaInit] = useState<LambdaModel>();
    const [lambda, setLambda] = useState<LambdaModel>();
    const [lambdaMetrics, setLambdaMetrics] = useState<LambdaMetrics[]>([]);
    const [errorFromMessage, setErrorFormMessage] = useState<string | null>(
        null,
    );
    const [activeTab, setActiveTab] = useState<
        "image" | "details" | "environments" | "visibility" | "monitor"
    >("details");
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const handleUpdateImage = async (lambdaParam: LambdaModel) => {
        try {
            throwIfLambdaCreationCandidateIsNotValid(lambda!);
        } catch (error) {
            if (error instanceof Error) {
                setErrorFormMessage(error.message);
                return;
            }
        }

        try {
            setLoading(true);
            await UpdateDeployLambda(projectId, lambdaParam);
            toastEventEmitter.emit("pop", {
                type: "success",
                message: "lambda updated",
                duration: 5000,
            });
            const lambdaUpdated = await GetLambdaById(projectId, lambdaId);
            setLambda(lambdaUpdated);
            setLambdaInit(lambdaUpdated);
        } catch (error) {
            toastEventEmitter.emit("pop", {
                type: "danger",
                message: error.error ?? "error when try to update lambda",
                duration: 5000,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateLambda = async (lambdaParam: LambdaModel) => {
        try {
            throwIfLambdaCreationCandidateIsNotValid(lambda!);
        } catch (error) {
            if (error instanceof Error) {
                setErrorFormMessage(error.message);
                return;
            }
        }

        try {
            setLoading(true);
            console.log("try to update lambda");
            console.log(lambdaParam);
            await UpdateLambda(projectId, lambdaParam);
            toastEventEmitter.emit("pop", {
                type: "success",
                message: "lambda updated",
                duration: 5000,
            });
            const lambdaUpdated = await GetLambdaById(projectId, lambdaId);
            setLambda(lambdaUpdated);
            setLambdaInit(lambdaUpdated);
        } catch (error) {
            toastEventEmitter.emit("pop", {
                type: "danger",
                message: error.error ?? "error when try to update lambda",
                duration: 5000,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!lambdaId) return;

        setLoading(true);
        GetLambdaMetrics({ projectId, lambdaId })
            .then((lambdaMetricsGet) => {
                setLambdaMetrics(lambdaMetricsGet);
            })
            .catch((error) => {
                toastEventEmitter.emit("pop", {
                    type: "danger",
                    message:
                        error.message ?? "error when try to get lambda info",
                    duration: 5000,
                });
            });

        GetLambdaById(projectId, lambdaId)
            .then((lambda) => {
                setLambda(lambda);
                setLambdaInit(lambda);
            })
            .catch((error) => {
                toastEventEmitter.emit("pop", {
                    type: "danger",
                    message:
                        error.message ?? "error when try to get lambda info",
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
                        {lambdaInit?.name}
                    </h2>
                </div>
                {errorFromMessage && (
                    <div
                        className="mb-4 flex w-2/6 flex-col items-center justify-center rounded-lg bg-red-50 p-4 text-sm text-red-800"
                        role="alert"
                    >
                        <span className="font-medium">Form not valid</span>
                        <p>{errorFromMessage}</p>
                    </div>
                )}
                {loading ? (
                    <div className="flex items-center justify-center">
                        <LoadingSpinner size="large" />
                    </div>
                ) : (
                    <TabsLambdaDetail
                        tab={activeTab}
                        onClick={(
                            tab:
                                | "details"
                                | "environments"
                                | "visibility"
                                | "monitor"
                                | "image",
                        ) => {
                            setActiveTab(tab);
                        }}
                    />
                )}
                {!loading && lambda && activeTab === "details" && (
                    <LambdaInformation
                        onUpdate={() => handleUpdateLambda(lambda)}
                        lambda={lambda}
                        setLambda={setLambda}
                    />
                )}
                {!loading && lambda && activeTab === "image" && (
                    <>
                        <h2 className="mb-5 ms-5 mt-10 w-4/5 text-xl font-bold">
                            Image Used
                        </h2>
                        <LambdaImageUpdate
                            onUpdateDeploy={() => handleUpdateImage(lambda)}
                            imageNameValue={lambda.imageName}
                            registryValue={LambdaRegistryToAvailableRegistriesInformation(
                                lambda.registry,
                            )}
                            handleImageNameChange={(image: string) => {
                                setLambda({
                                    ...lambda,
                                    imageName: image,
                                });
                            }}
                            handleRegistryChange={(
                                registry: AvailableRegistriesInformation,
                            ) => {
                                setLambda({
                                    ...lambda,
                                    registry:
                                        AvailableRegistriesToRegistry(registry),
                                });
                            }}
                        />
                    </>
                )}
                {/* {!loading && lambda && activeTab === "environments" && (
                    <div className="w-4/5">
                        <h2 className="mb-5 ms-5 mt-10 w-4/5 text-xl font-bold">
                            Lambda Variables
                        </h2>
                        <LambdaEnvVarForm
                            variables={lambdaModelEnvToLambdaEnvironment(
                                lambda.environmentVariables,
                            )}
                            handleAddEnvironmentVariable={() => {
                                const newEnvironmentVariables = [
                                    ...lambda.environmentVariables,
                                ];
                                newEnvironmentVariables.push({
                                    key: "",
                                    value: "",
                                });
                                setLambda({
                                    ...lambda,
                                    environmentVariables:
                                        newEnvironmentVariables,
                                });
                            }}
                            handleRemoveEnvironmentVariable={(
                                index: number,
                            ) => {
                                const newEnvironmentVariables = [
                                    ...lambda.environmentVariables,
                                ];
                                newEnvironmentVariables.splice(index, 1);
                                setLambda({
                                    ...lambda,
                                    environmentVariables:
                                        newEnvironmentVariables,
                                });
                            }}
                            handleEnvironmentVariableChange={(
                                index: number,
                                whereToChange: "name" | "value",
                                value: string,
                            ) => {
                                const newEnvironmentVariables = [
                                    ...lambda.environmentVariables,
                                ];
                                newEnvironmentVariables[index][
                                    whereToChange === "name" ? "key" : "value"
                                ] = value;
                                setLambda({
                                    ...lambda,
                                    environmentVariables:
                                        newEnvironmentVariables,
                                });
                            }}
                        />
                        <div className="flex w-full items-center justify-center">
                            <button
                                type="submit"
                                className="Button stuga-primary-color mt-10 w-full"
                                onClick={() => {
                                    handleUpdateLambda(lambda);
                                }}
                            >
                                Update environnement variables
                            </button>
                        </div>
                    </div>
                )} */}
                {!loading && lambda && activeTab === "visibility" && (
                    <div className="w-4/5">
                        <h2 className="mb-5 ms-5 mt-10 w-4/5 text-xl font-bold">
                            Lambda Visibility
                        </h2>
                        <LambdaConfidentialityUpdate
                            value={lambda.confidentiality}
                            handleVisibilityChange={(
                                value: LambdaVisibility,
                            ) => {
                                setLambda({
                                    ...lambda,
                                    confidentiality: value,
                                });
                            }}
                        />
                        <div className="flex w-full items-center justify-center">
                            <button
                                type="submit"
                                className="Button stuga-primary-color mt-10 w-full"
                                onClick={() => {
                                    handleUpdateLambda(lambda);
                                }}
                            >
                                Update visibility
                            </button>
                        </div>
                    </div>
                )}
                {!loading && lambda && activeTab === "monitor" && (
                    <LambdaMonitor lambdaMetrics={lambdaMetrics} />
                )}
            </div>
        </>
    );
}
