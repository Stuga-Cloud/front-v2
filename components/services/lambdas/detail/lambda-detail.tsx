"use client";
import { toastEventEmitter } from "@/lib/event-emitter/toast-event-emitter";
import { GetLambdaById } from "@/lib/services/lambdas/client/get-lambda-by-id";
import { Lambda } from "@prisma/client";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { LoadingSpinner } from "@/components/shared/icons";
import TabsLambdaDetail from "./tabs-lambda-detail";
import LambdaInformation from "./lambda-information";
import LambdaEnvVarForm from "../create/lambda-env-var";
import LambdaConfidentialityForm from "../create/lambda-confidentiality-form";
import { LambdaModel } from "@/lib/models/lambdas/lambda";
import { LambdaVisibility } from "@/lib/models/lambdas/lambda-create";
import LambdaImageForm, {
    AvailableRegistriesInformation,
} from "../create/lambda-image-form";
import LambdaImageUpdate from "./lambda-image-update";

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
        "image" | "details" | "environments" | "visibility" | "monitor"
    >("details");
    const [lambda, setLambda] = useState<LambdaModel>();
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
                                | "monitor"
                                | "image",
                        ) => {
                            setActiveTab(tab);
                        }}
                    />
                )}
                {!loading && lambda && activeTab === "details" && (
                    <LambdaInformation lambda={lambda} setLambda={setLambda} />
                )}
                {!loading && lambda && activeTab === "image" && (
                    <>
                        <h2 className="mb-5 ms-5 mt-10 w-4/5 text-xl font-bold">
                            Image Used
                        </h2>
                        <LambdaImageUpdate
                            imageNameValue={lambda.imageName}
                            handleImageNameChange={(image: string) => {
                                setLambda({
                                    ...lambda,
                                    imageName: image,
                                });
                            }}
                            handleRegistryChange={(
                                registry: AvailableRegistriesInformation,
                            ) => {}}
                        />
                    </>
                )}
                {!loading && lambda && activeTab === "environments" && (
                    <LambdaEnvVarForm
                        variables={[]}
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
                                environmentVariables: newEnvironmentVariables,
                            });
                        }}
                        handleRemoveEnvironmentVariable={(index: number) => {
                            const newEnvironmentVariables = [
                                ...lambda.environmentVariables,
                            ];
                            newEnvironmentVariables.splice(index, 1);
                            setLambda({
                                ...lambda,
                                environmentVariables: newEnvironmentVariables,
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
                                environmentVariables: newEnvironmentVariables,
                            });
                        }}
                    />
                )}
                {!loading && lambda && activeTab === "visibility" && (
                    <LambdaConfidentialityForm
                        value={lambda.confidentiality}
                        handleVisibilityChange={(value: LambdaVisibility) => {
                            setLambda({
                                ...lambda,
                                confidentiality: value,
                            });
                        }}
                    />
                )}
            </div>
        </>
    );
}
