"use client";
import LoadingSpinner from "@/components/shared/icons/loading-spinner";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import LambdaStepper from "./lambda-stepper";
import LambdaNameForm from "./lambda-name-form";
import { isLambdaNameValid } from "./form-validation/lambda-create-validation";
import LambdaImageForm from "./lambda-image-form";
import { AvailableRegistriesInformation } from "./lambda-image-form";
import LambdaEnvVarForm, { LambdaEnvironmentVariable } from "./lambda-env-var";
import LambdaConfidentialityForm from "./lambda-confidentiality-form";
import { ContainerEnvironmentVariable } from "@/lib/models/containers/container-application-environment-variables";
import LambdaSettingsForm from "./lambda-settings-form";
import {
    Step,
    cpuLimitsChoices,
    memoryLimitsChoices,
} from "./types/lambda-create";
import LambdaScalabilityForm from "./lambda-scalability-form";

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
    const [confidentiality, setConfidentiality] = useState<
        "public" | "private"
    >("public");
    const [activeStep, setActiveStep] = useState(1);
    const [lambdaName, setLambdaName] = useState("my-first-lambda");
    const [imageName, setImageName] = useState("");
    const [
        applicationEnvironmentVariables,
        setApplicationEnvironmentVariables,
    ] = useState<ContainerEnvironmentVariable[]>([]);
    const [registry, setRegistry] = useState<AvailableRegistriesInformation>();
    const [cpuConfig, setCpuConfig] = useState("1000 mCPU");
    const [memoryConfig, setMemoryConfig] = useState("256 Mo");
    const [loading, setLoading] = useState(false);

    const stepsBase: Step[] = [
        {
            name: "Lambda name",
            description: "Enter your lambda name",
            svgPath: (
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
                ></path>
            ),
        },
        {
            name: "Image",
            description: "Set lambda image to deploy",
            svgPath: (
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                ></path>
            ),
        },
        {
            name: "Environment variables",
            description: "Set environment variables",
            svgPath: (
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                ></path>
            ),
        },
        {
            name: "Confidentiality",
            description: "Set lambda confidentiality",
            svgPath: (
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                ></path>
            ),
        },
        {
            name: "Lambda specifications",
            description: "CPU & Memory & Timeout",
            svgPath: (
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5"
                ></path>
            ),
        },
        {
            name: "Lambda Scalability limits",
            description:
                "Select the min instance number and the max instance number",
            svgPath: (
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z"
                ></path>
            ),
        },
        // {
        //     name: "Price",
        //     description:
        //         "See price estimation of your configuration before deploying",
        //     svgPath: (
        //         <path
        //             strokeLinecap="round"
        //             d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25"
        //         ></path>
        //     ),
        // },
    ];

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
                {loading ? (
                    <div className="flex h-[10vh] items-center justify-center">
                        <LoadingSpinner />
                    </div>
                ) : null}
                <form className="flex w-11/12 flex-col py-10">
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
                                    handleImageNameChange={(image: string) => {
                                        setImageName(image);
                                    }}
                                    handleRegistryChange={(
                                        registry: AvailableRegistriesInformation,
                                    ) => {
                                        setRegistry(registry);
                                    }}
                                />
                            )}
                            {activeStep === 3 && (
                                <LambdaEnvVarForm
                                    variables={applicationEnvironmentVariables}
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
                                        value: "public" | "private",
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
                                        cpuConfig: string,
                                        memoryConfig: string,
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
                                    setMinInstanceNumber={(value: number) => {
                                        setMinInstanceNumber(value);
                                    }}
                                    setMaxInstanceNumber={(value: number) => {
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
            </div>
        </>
    );
}
