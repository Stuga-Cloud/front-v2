"use client";
import LoadingSpinner from "@/components/shared/icons/loading-spinner";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import LambdaStepper from "./lambda-stepper";
import LambdaNameForm from "./lambda-name-form";
import LambdaImageForm from "./lambda-image-form";
import { AvailableRegistriesInformation } from "./lambda-image-form";
import LambdaEnvVarForm, { LambdaEnvironmentVariable } from "./lambda-env-var";
import LambdaConfidentialityForm from "./lambda-confidentiality-form";
import { ContainerEnvironmentVariable } from "@/lib/models/containers/container-application-environment-variables";
import LambdaSettingsForm from "./lambda-settings-form";
import LambdaScalabilityForm from "./lambda-scalability-form";
import {
    cpuLimitsChoices,
    memoryLimitsChoices,
    stepsBase,
} from "../../../../lib/models/lambdas/config/lambda-create-config";
import { CreateLambda } from "@/lib/services/lambdas/client/create-lambda";
import { toastEventEmitter } from "@/lib/event-emitter/toast-event-emitter";
import { StugaError } from "@/lib/services/error/error";
import { LambdaCPULimit, LambdaCreateCandidate, LambdaMemoryLimit, LambdaVisibility, Registry } from "@/lib/models/lambdas/lambda-create";
import { isLambdaNameValid, throwIfLambdaCreationCandidateIsNotValid } from "@/lib/models/lambdas/validation/lambda-create-candidate";

export const availableRegistriesToRegistry = (availableRegistry: AvailableRegistriesInformation): Registry => {
    if (availableRegistry.name === "Docker hub") {
        return "dockerhub";
    } else {
        return "pcr";
    }
};

export default function NewLambdaForm({
    session,
    projectId,
}: {
    session: Session | null;
    projectId: string;
}) {
    const [timeout, setTimeout] = useState(4);
    const [minInstanceNumber, setMinInstanceNumber] = useState(0);
    const [maxInstanceNumber, setMaxInstanceNumber] = useState(2);
    const [confidentiality, setConfidentiality] = useState<LambdaVisibility>({
        visibility: "public",
    });
    const [activeStep, setActiveStep] = useState(1);
    const [lambdaName, setLambdaName] = useState("my-first-lambda");
    const [imageName, setImageName] = useState("");
    const [
        applicationEnvironmentVariables,
        setApplicationEnvironmentVariables,
    ] = useState<LambdaEnvironmentVariable[]>([]);
    const [registry, setRegistry] = useState<Registry>("dockerhub");
    const [cpuConfig, setCpuConfig] = useState(cpuLimitsChoices[0]);
    const [memoryConfig, setMemoryConfig] = useState(memoryLimitsChoices[0]);
    const [loading, setLoading] = useState(false);
    const [errorFromMessage, setErrorFormMessage] = useState<string | null>(
        null,
    );

    const handleSubmit = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        setErrorFormMessage("");
        const form: LambdaCreateCandidate = {
            minInstanceNumber,
            maxInstanceNumber,
            timeout,
            confidentiality,
            name: lambdaName,
            imageName,
            registry,
            cpuLimit: cpuConfig,
            memoryLimit: memoryConfig,
            environmentVariables: applicationEnvironmentVariables.map(
                (envVar) => ({
                    key: envVar.name,
                    value: envVar.value,
                }),
            ),
        };
        try {
            throwIfLambdaCreationCandidateIsNotValid(form);
        } catch (error) {
            if (error instanceof Error) {
                setErrorFormMessage(error.message);
                return;
            }
        }

        try {
            setLoading(true);
            await CreateLambda(projectId, form);
            toastEventEmitter.emit("pop", {
                type: "success",
                message: "lambda well created",
                duration: 4000,
            });
        } catch (error) {
            if (error instanceof StugaError) {
                toastEventEmitter.emit("pop", {
                    type: "danger",
                    message: error.message,
                    duration: 4000,
                });
            }
        } finally {
            setLoading(false);
        }
    };
    const handleKeyDown = (event: any) => {
        if (event.key === "Enter") {
            event.preventDefault();
        }
    };

    return (
        <>
            <div className="w-5/5 z-10 flex flex-col items-center justify-center px-5">
                {/* Change interline with more space */}
                <h1 className="mb-2 text-center text-3xl font-extrabold leading-loose leading-relaxed tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
                    Deploy your{" "}
                    <mark className="rounded bg-green-400 px-2 leading-relaxed text-white">
                        function
                    </mark>{" "}
                    in{" "}
                    <mark className="rounded bg-green-400 px-2 leading-relaxed text-white">
                        container
                    </mark>
                </h1>

                <p
                    className="text-l lg:text-l pb-5 font-normal text-gray-500"
                    id="step-name"
                >
                    Deploy your function in our cloud in a few clicks.
                </p>
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
                    <div className="flex h-[10vh] items-center justify-center">
                        <LoadingSpinner size="large" />
                    </div>
                ) : null}
                {!loading && (
                    <form
                        onSubmit={handleSubmit}
                        onKeyDown={handleKeyDown}
                        className="flex w-11/12 flex-col py-10"
                    >
                        {/* Place stepper information on left side and form on right side */}
                        <div className="flex w-full flex-row items-start align-middle">
                            <div className="w-3/10 flex flex-col pt-5">
                                {/* Stepper information */}
                                <LambdaStepper
                                    steps={stepsBase}
                                    activeStep={activeStep}
                                    handleChangeActiveStep={(step: number) =>
                                        setActiveStep(step)
                                    }
                                />
                            </div>
                            <div className="flex w-full flex-col px-5">
                                <h4 className="py-4 text-2xl font-bold">
                                    <label
                                        htmlFor="name"
                                        className="mb-7 text-lg text-gray-700 md:text-3xl"
                                    >
                                        {stepsBase[activeStep - 1].name}
                                    </label>
                                </h4>

                                {activeStep === 1 && (
                                    <LambdaNameForm
                                        name={lambdaName}
                                        isLambdaNameValid={(name) =>
                                            isLambdaNameValid(name)
                                        }
                                        handleChangeName={(name: string) =>
                                            setLambdaName(name)
                                        }
                                    />
                                )}
                                {activeStep === 2 && (
                                    <LambdaImageForm
                                        handleImageNameChange={(
                                            image: string,
                                        ) => {
                                            setImageName(image);
                                        }}
                                        handleRegistryChange={(
                                            registry: AvailableRegistriesInformation,
                                        ) => {
                                            const registryModel = availableRegistriesToRegistry(
                                                registry,
                                            );
                                            setRegistry(registryModel);
                                        }}
                                    />
                                )}
                                {activeStep === 3 && (
                                    <LambdaEnvVarForm
                                        variables={
                                            applicationEnvironmentVariables
                                        }
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
                                            console.log(
                                                applicationEnvironmentVariables,
                                            );
                                        }}
                                        handleRemoveEnvironmentVariable={(
                                            index: number,
                                        ) => {
                                            const newEnvironmentVariables = [
                                                ...applicationEnvironmentVariables,
                                            ];
                                            newEnvironmentVariables.splice(
                                                index,
                                                1,
                                            );
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
                                            newEnvironmentVariables[index][
                                                whereToChange
                                            ] = value;
                                            setApplicationEnvironmentVariables(
                                                newEnvironmentVariables,
                                            );
                                        }}
                                    />
                                )}
                                {activeStep === 4 && (
                                    <LambdaConfidentialityForm
                                        value={confidentiality}
                                        handleVisibilityChange={(
                                            value: LambdaVisibility,
                                        ) => {
                                            setConfidentiality(value);
                                        }}
                                    />
                                )}
                                {activeStep === 5 && (
                                    <LambdaSettingsForm
                                        timeout={timeout}
                                        cpuChoices={cpuLimitsChoices}
                                        memoryChoices={memoryLimitsChoices}
                                        cpuConfig={cpuConfig}
                                        memoryConfig={memoryConfig}
                                        onChange={(
                                            cpuConfig: LambdaCPULimit,
                                            memoryConfig: LambdaMemoryLimit,
                                            timeout: number,
                                        ) => {
                                            setCpuConfig(cpuConfig);
                                            setMemoryConfig(memoryConfig);
                                            setTimeout(timeout);
                                        }}
                                    />
                                )}
                                {activeStep === 6 && (
                                    <LambdaScalabilityForm
                                        maxInstanceNumber={maxInstanceNumber}
                                        minInstanceNumber={minInstanceNumber}
                                        setMinInstanceNumber={(
                                            value: number,
                                        ) => {
                                            setMinInstanceNumber(value);
                                        }}
                                        setMaxInstanceNumber={(
                                            value: number,
                                        ) => {
                                            setMaxInstanceNumber(value);
                                        }}
                                        isMaxInstanceNumberValid={(
                                            value: number,
                                        ) => {
                                            return (
                                                value <= 10 &&
                                                value >= minInstanceNumber
                                            );
                                        }}
                                        isMinInstanceNumberValid={(
                                            value: number,
                                        ) => {
                                            return (
                                                value >= 0 &&
                                                value <= maxInstanceNumber
                                            );
                                        }}
                                    />
                                )}
                                <div className="flex justify-between">
                                    {activeStep === 1 && (
                                        <button
                                            type="button"
                                            // onClick={}
                                            className="invisible"
                                        />
                                    )}
                                    {activeStep > 1 && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setActiveStep(activeStep - 1)
                                            }
                                            className="Button stuga-orange-color"
                                        >
                                            Previous
                                        </button>
                                    )}
                                    {activeStep < stepsBase.length && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setActiveStep(activeStep + 1)
                                            }
                                            className="Button stuga-primary-color"
                                        >
                                            Next
                                        </button>
                                    )}
                                    {activeStep === stepsBase.length && (
                                        <button
                                            type="submit"
                                            className="Button stuga-primary-color"
                                        >
                                            Deploy lambda
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </>
    );
}
