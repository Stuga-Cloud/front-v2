"use client";
import { Session } from "next-auth";
import React, { useEffect, useState } from "react";
import LoadingSpinner from "@/components/shared/icons/loading-spinner";
import { redirect, useRouter } from "next/navigation";
import { Project } from "@/lib/models/project";
import * as process from "process";
import { ContainerApplicationType } from "@/lib/models/containers/container-application-type";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import axios from "axios";
import { CreateContainerApplicationBody } from "@/lib/services/containers/create-container-application.body";
import { ContainerEnvironmentVariable } from "@/lib/models/containers/container-application-environment-variables";
import { ContainerApplicationSecret } from "@/lib/models/containers/container-application-secrets";
import { ContainerLimitUnit } from "@/lib/models/containers/container-application-specifications";
import { StugaError } from "@/lib/services/error/error";
import { ContainerApplicationNamespace } from "@/lib/models/containers/container-application-namespace";
import { DisplayToast } from "@/components/shared/toast/display-toast";
import { ContainerApplication } from "@/lib/models/containers/container-application";
import { isEmailValid } from "@/lib/utils";
import {
    ApplicationCPULimit,
    ApplicationMemoryLimit,
    availableContainerRegistries,
    AvailableContainerRegistriesInformation,
    AvailableContainerRegistriesName,
    findRegistryByName,
} from "@/components/services/containers/applications/create/container-creation";
import { displayImageInRegistryUrl } from "../details/tabs/container-deployment";

export const MAX_REPLICAS = 3;

export const CPU_LIMIT_AVAILABLE_CHOICES: ApplicationCPULimit[] = [
    { value: 70, unit: "mCPU" },
    { value: 140, unit: "mCPU" },
    { value: 280, unit: "mCPU" },
    { value: 560, unit: "mCPU" },
    { value: 1120, unit: "mCPU" },
    // { value: 1680, unit: "mCPU" },
    // { value: 2240, unit: "mCPU" },
];
export const MEMORY_LIMIT_AVAILABLE_CHOICES: ApplicationMemoryLimit[] = [
    { value: 128, unit: "MB" },
    { value: 256, unit: "MB" },
    { value: 512, unit: "MB" },
    { value: 1024, unit: "MB" },
    { value: 2048, unit: "MB" },
    // { value: 4096, unit: "MB" },
    // { value: 8192, unit: "MB" },
];

interface Step {
    name: string;
    description: string;
    svgPath: any;
}

export default function NewContainerForm({
    session,
    projectId,
    namespaceId,
}: {
    session: Session | null;
    projectId: string;
    namespaceId: string;
}) {
    if (!session) redirect("/");
    const router = useRouter();

    const user = session?.user;

    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    const [applicationNamespace, setApplicationNamespace] =
        useState<ContainerApplicationNamespace | null>(null);
    const [containers, setContainers] = useState<ContainerApplication[]>([]);

    const loadNamespace = async () => {
        setLoading(true);
        return axios.get(
            `/api/projects/${projectId}/services/containers/namespaces/${namespaceId}`,
        );
    };

    useEffect(() => {
        if (!projectId || !namespaceId) return;

        loadNamespace()
            .then((response) => {
                setApplicationNamespace(response.data.namespace);
                setContainers(response.data.namespaceInAPI.applications);
            })
            .catch((error) => {
                console.log(error);
                DisplayToast({
                    type: "error",
                    message:
                        "Could not retrieve namespace information, please try again later or contact support",
                    duration: 3000,
                });
                router.push(`/projects/${projectId}/services/containers`);
            })
            .finally(() => setLoading(false));
    }, [projectId, namespaceId]);

    const [project, setProject] = useState({} as Project);
    const [applicationName, setApplicationName] = useState<string | undefined>(
        undefined,
    );
    const [description, setDescription] = useState<string | undefined>(
        undefined,
    );
    const [registry, setRegistry] =
        useState<AvailableContainerRegistriesInformation>(
            findRegistryByName("Docker hub"),
        );
    const [applicationImage, setApplicationImage] = useState<
        string | undefined
    >(undefined);
    const [applicationPort, setApplicationPort] = useState<number | undefined>(
        80,
    );
    const [applicationType, setApplicationType] =
        useState<ContainerApplicationType>("LOAD_BALANCED");
    const [
        applicationEnvironmentVariables,
        setApplicationEnvironmentVariables,
    ] = useState<ContainerEnvironmentVariable[]>([]);
    const [applicationSecrets, setApplicationSecrets] = useState<
        ContainerApplicationSecret[]
    >([]);

    const [applicationCpuLimit, setApplicationCpuLimit] = useState<string>(
        CPU_LIMIT_AVAILABLE_CHOICES[0].value.toString(),
    );
    useState<string>("");
    const [applicationMemoryLimit, setApplicationMemoryLimit] =
        useState<string>(MEMORY_LIMIT_AVAILABLE_CHOICES[0].value.toString());

    const [isAutoscalingEnabled, setIsAutoscalingEnabled] =
        useState<boolean>(false);
    const [cpuUsageThreshold, setCpuUsageThreshold] = useState<number>(80);
    const [memoryUsageThreshold, setMemoryUsageThreshold] =
        useState<number>(80);
    const [replicas, setReplicas] = useState<number>(1);

    const [administratorEmail, setAdministratorEmail] = useState<
        string | undefined
    >(undefined);

    const handleNext = () => {
        setStep((prevStep) => prevStep + 1);
    };

    const handlePrevious = () => {
        setStep((prevStep) => prevStep - 1);
    };

    const stepsBase: Step[] = [
        {
            name: "Application name",
            description: "Enter your application name",
            svgPath: (
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
                ></path>
            ),
        },
        {
            name: "Image",
            description: "Set application image to deploy",
            svgPath: (
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                ></path>
            ),
        },
        {
            name: "Application port",
            description: "Enter port used by your application",
            svgPath: (
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                ></path>
            ),
        },
        {
            name: "Should your application be scalable ?",
            description: "Select your application type",
            svgPath: (
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
            ),
        },
        {
            name: "Container(s) specifications",
            description: "Set container(s) specifications (CPU & Memory)",
            svgPath: (
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5"
                ></path>
            ),
        },
        {
            name: "Scalability Configuration",
            description: "Choose your application scalability configuration",
            svgPath: (
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z"
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
                    d="M4.745 3A23.933 23.933 0 003 12c0 3.183.62 6.22 1.745 9M19.5 3c.967 2.78 1.5 5.817 1.5 9s-.533 6.22-1.5 9M8.25 8.885l1.444-.89a.75.75 0 011.105.402l2.402 7.206a.75.75 0 001.104.401l1.445-.889m-8.25.75l.213.09a1.687 1.687 0 002.062-.617l4.45-6.676a1.688 1.688 0 012.062-.618l.213.09"
                ></path>
            ),
        },
        {
            name: "Secrets",
            description: "Set secrets",
            svgPath: (
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                ></path>
            ),
        },
        {
            name: "Administrator",
            description:
                "Set administrator email for scalability notifications",
            svgPath: (
                <path
                    strokeLinecap="round"
                    d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25"
                ></path>
            ),
        },
    ];

    const [steps, setSteps] = useState<Step[]>(stepsBase);

    useEffect(() => {
        if (applicationType === "SINGLE_INSTANCE") {
            setSteps(stepsBase.slice(0, 7).concat(stepsBase.slice(8)));
        } else {
            setSteps(stepsBase);
        }
    }, [applicationType]);

    const getProject = async (projectId: string) => {
        try {
            const res = await fetch(`/api/projects/${projectId}`);
            return await res.json();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (!projectId) return;
        setLoading(true);
        getProject(projectId)
            .then((project) => {
                setProject(project);
                setLoading(false);
            })
            .catch((error) => {
                DisplayToast({
                    type: "error",
                    message: `Could not load project ${projectId}, please try again later or contact support`,
                    duration: 4000,
                });
                console.error(
                    "error when try to get project in new containerized application form",
                    error,
                );
                setLoading(false);
                router.push(`/`);
            });
    }, [projectId]);

    const isApplicationNameAvailableInNamespace = () => {
        if (!applicationName || !applicationNamespace) return true;
        if (!containers || containers.length == 0) return true;
        return !containers.some(
            (application) => application.name === applicationName,
        );
    };

    const applicationNameUpdated = (e: any) => {
        setApplicationName(e.target.value);
        isApplicationNameAvailableInNamespace();
    };

    const applicationDescriptionUpdated = (e: any) => {
        setDescription(e.target.value);
    };

    const stringInSubdomainRegex = new RegExp(
        "^[a-z0-9]([-a-z0-9]*[a-z0-9])?$",
    );

    const isApplicationNameValid = (
        applicationName: string | undefined,
    ): boolean => {
        return (
            applicationName == undefined ||
            (applicationName.length > 0 &&
                stringInSubdomainRegex.test(applicationName))
        );
    };

    const isImageValid = (image: string | undefined) => {
        return (
            image == undefined ||
            (image.length > 0 &&
                image.includes("/") &&
                image.includes(":") &&
                image[image.length - 1] !== ":" &&
                image[image.length - 1] !== "/")
        );
    };

    const isPortValid = (port: number | undefined) => {
        return port == undefined || (port >= 1 && port <= 65535);
    };

    const applicationImageUpdated = (e: any) => {
        setApplicationImage(e.target.value);
    };

    const keyVarsMessage =
        "Invalid environment variable name, please use only letters, numbers and underscores and start with a letter or underscore";
    const validateEnvironmentVariableOrSecretKey = (
        key: string,
        vars: ContainerEnvironmentVariable[] | ContainerApplicationSecret[],
        type: "environment variable" | "secret",
    ) => {
        if (key.length === 0) {
            return true;
        }
        if (vars.some((envVar) => envVar.name === key)) {
            DisplayToast({
                type: "error",
                message: `Duplicate ${type} name '${key}'`,
            });
        }
        if (key.includes(" ")) {
            DisplayToast({
                type: "error",
                message: keyVarsMessage,
            });
            return false;
        }
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key)) {
            DisplayToast({
                type: "error",
                message: keyVarsMessage,
            });
            return false;
        }
        return true;
    };

    const handleEnvironmentVariableChange = (
        index: number,
        whereToChange: "name" | "value",
        value: string,
    ) => {
        if (whereToChange === "name") {
            if (
                !validateEnvironmentVariableOrSecretKey(
                    value,
                    applicationEnvironmentVariables,
                    "environment variable",
                )
            ) {
                return;
            }
        }
        const newEnvironmentVariables = [...applicationEnvironmentVariables];
        newEnvironmentVariables[index][whereToChange] = value;
        setApplicationEnvironmentVariables(newEnvironmentVariables);
    };
    const handleRemoveEnvironmentVariable = (index: number) => {
        const newEnvironmentVariables = [...applicationEnvironmentVariables];
        newEnvironmentVariables.splice(index, 1);
        setApplicationEnvironmentVariables(newEnvironmentVariables);
    };
    const handleAddEnvironmentVariable = () => {
        const newEnvironmentVariables = [...applicationEnvironmentVariables];
        newEnvironmentVariables.push({ name: "", value: "" });
        setApplicationEnvironmentVariables(newEnvironmentVariables);
    };

    const handleSecretChange = (
        index: number,
        whereToChange: "name" | "value",
        value: string,
    ) => {
        if (whereToChange === "name") {
            if (
                !validateEnvironmentVariableOrSecretKey(
                    value,
                    applicationSecrets,
                    "secret",
                )
            ) {
                return;
            }
        }
        const newSecrets = [...applicationSecrets];
        newSecrets[index][whereToChange] = value;
        setApplicationSecrets(newSecrets);
    };
    const handleRemoveSecret = (index: number) => {
        const newSecrets = [...applicationSecrets];
        newSecrets.splice(index, 1);
        setApplicationSecrets(newSecrets);
    };
    const handleAddSecret = () => {
        const newSecrets = [...applicationSecrets];
        newSecrets.push({ name: "", value: "" });
        setApplicationSecrets(newSecrets);
    };

    const updateReplicas = (e: any) => {
        const removeFirstZeros = e.target.value.replace(/^0+/, "");
        const numberOfReplicas = parseInt(removeFirstZeros);
        setReplicas(numberOfReplicas);
    };

    const updateCpuUsageThreshold = (e: any) => {
        const removeFirstZeros = e.target.value.replace(/^0+/, "");
        const cpuUsageThreshold = parseInt(removeFirstZeros);
        setCpuUsageThreshold(cpuUsageThreshold);
    };

    const updateMemoryUsageThreshold = (e: any) => {
        const removeFirstZeros = e.target.value.replace(/^0+/, "");
        const memoryUsageThreshold = parseInt(removeFirstZeros);
        setMemoryUsageThreshold(memoryUsageThreshold);
    };

    const isReplicasValid = (replicas: number | undefined) => {
        return (
            replicas == undefined || (replicas >= 1 && replicas <= MAX_REPLICAS)
        );
    };

    const isCPULimitValid = (cpuLimit: string | undefined) => {
        return (
            cpuLimit == undefined ||
            CPU_LIMIT_AVAILABLE_CHOICES.some(
                (cpuLimitChoice) => `${cpuLimitChoice.value}` === cpuLimit,
            )
        );
    };

    const isMemoryLimitValid = (memoryLimit: string | undefined) => {
        return (
            memoryLimit == undefined ||
            MEMORY_LIMIT_AVAILABLE_CHOICES.some(
                (memoryLimitChoice) =>
                    `${memoryLimitChoice.value}` === memoryLimit,
            )
        );
    };

    const isCpuUsageThresholdValid = (
        cpuUsageThreshold: number | undefined,
    ): boolean => {
        return (
            cpuUsageThreshold == undefined ||
            (cpuUsageThreshold >= 0 && cpuUsageThreshold <= 100)
        );
    };

    const isMemoryUsageThresholdValid = (
        memoryUsageThreshold: number | undefined,
    ): boolean => {
        return (
            memoryUsageThreshold == undefined ||
            (memoryUsageThreshold >= 0 && memoryUsageThreshold <= 100)
        );
    };

    const handleKeyDown = (event: any) => {
        if (event.key === "Enter") {
            event.preventDefault();
        }
    };

    const validateForm = () => {
        const errors: string[] = [];
        if (!applicationName || !isApplicationNameValid(applicationName)) {
            errors.push("Application name is not valid");
        }
        if (!isApplicationNameAvailableInNamespace()) {
            errors.push(
                "Application name is not available in this namespace, please choose another one",
            );
        }
        if (!applicationPort || !isPortValid(applicationPort)) {
            errors.push(
                "Application port is not valid, it should be between 1 and 65535",
            );
        }
        if (!administratorEmail || !isEmailValid(administratorEmail)) {
            errors.push(
                "Application email is not valid, please use a valid email",
            );
        }
        if (!applicationImage || !isImageValid(applicationImage)) {
            errors.push(
                "Application image is not valid, please use the format: <registry>/<image>:<tag>",
            );
        }
        if (!isReplicasValid(replicas)) {
            errors.push("Replicas is not valid, it should be between 1 and 10");
        }
        if (!isCPULimitValid(applicationCpuLimit)) {
            errors.push(
                "CPU limit is not valid, please choose a valid value in the available choices",
            );
        }
        if (!isMemoryLimitValid(applicationMemoryLimit)) {
            errors.push(
                "Memory limit is not valid, please choose a valid value in the available choices",
            );
        }
        if (!isCpuUsageThresholdValid(cpuUsageThreshold)) {
            errors.push(
                "CPU usage threshold is not valid, it should be >= 0 and <= 100",
            );
        }
        if (!isMemoryUsageThresholdValid(memoryUsageThreshold)) {
            errors.push(
                "Memory usage threshold is not valid, it should be >= 0 and <= 100",
            );
        }
        return errors;
    };

    const handleSubmit = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        const errors = validateForm();
        if (errors.length > 0) {
            const displayTime =
                errors.reduce((acc, error) => acc + error.length, 0) * 100;

            DisplayToast({
                type: "error",
                message: `Your form is not valid, please fix the following errors: \n${errors
                    .map((error) => `- ${error}`)
                    .join("\n")}`,
                duration: displayTime,
            });
            return;
        }
        try {
            setLoading(true);
            // Query back to verify that the application and namespace are available
            const createContainerApplicationBody: CreateContainerApplicationBody =
                {
                    name: applicationName!,
                    description: description!,
                    zone: "europe-west-1",
                    image: applicationImage!,
                    registry: registry.registry,
                    port: applicationPort!,
                    applicationType: applicationType!,
                    environmentVariables: applicationEnvironmentVariables,
                    secrets: applicationSecrets,
                    containerSpecifications: {
                        cpuLimit: {
                            value: parseInt(applicationCpuLimit!),
                            unit: "mCPU",
                        }!,
                        memoryLimit: {
                            value: parseInt(applicationMemoryLimit!),
                            unit: ContainerLimitUnit.MB,
                        },
                    },
                    scalabilitySpecifications: {
                        replicas: replicas!,
                        memoryUsagePercentageThreshold: memoryUsageThreshold!,
                        cpuUsagePercentageThreshold: cpuUsageThreshold!,
                        isAutoScaled: isAutoscalingEnabled!,
                    },
                    administratorEmail: administratorEmail!,
                    userId: "",
                    namespaceId: "",
                };
            const createdContainer = await axios(
                `/api/projects/${projectId}/services/containers/namespaces/${namespaceId}/applications`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    data: createContainerApplicationBody,
                },
            );
            DisplayToast({
                type: "success",
                message: `Application ${applicationName} created`,
                duration: 5000,
            });
            setLoading(false);
            router.push(
                `/projects/${projectId}/services/containers/namespaces/${namespaceId}/applications/${createdContainer.data.id}`,
            );
        } catch (error: any) {
            setLoading(false);
            console.log("Error while creating application", error);
            if (error.response.data.error == "Image not found in registry") {
                DisplayToast({
                    type: "error",
                    message: `Image not found in registry`,
                    duration: 4000,
                });
                return;
            }
            if (error instanceof StugaError) {
                DisplayToast({
                    type: "error",
                    message: error.message,
                    duration: 4000,
                });
                return;
            }
            DisplayToast({
                type: "error",
                message: `Couldn't create application ${applicationName}, please try again later or contact support`,
                duration: 4000,
            });
        }
    };

    return (
        <>
            <div className="z-10 flex w-full flex-col items-center justify-center px-5">
                {/* Change interline with more space */}
                <h1 className="mb-2 text-center text-3xl font-extrabold leading-loose leading-relaxed tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
                    Deploy your{" "}
                    <mark className="rounded bg-green-400 px-2 leading-relaxed text-white">
                        application
                    </mark>{" "}
                    in{" "}
                    <mark className="rounded bg-green-400 px-2 leading-relaxed text-white">
                        containers
                    </mark>
                </h1>

                <p
                    className="text-l lg:text-l pb-5 font-normal text-gray-500"
                    id="step-name"
                >
                    Deploy your applications, databases, and services in our
                    cloud in a few clicks.
                </p>
                {loading ? (
                    <div className="flex h-[10vh] items-center justify-center">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        onKeyDown={handleKeyDown}
                        className="flex w-11/12 flex-col py-10"
                    >
                        {/* Place stepper information on left side and form on right side */}
                        <div className="flex w-full flex-row items-start align-middle">
                            {/* Stepper information */}
                            <div className="w-3/10 flex flex-col pt-5">
                                <div>
                                    <ol className="relative border-l border-gray-200 text-gray-500 ">
                                        {steps.length <= 0 && (
                                            <div className="flex flex-col items-center justify-center">
                                                <p className="text-gray-500">
                                                    No steps found
                                                </p>
                                                <p className="text-gray-500">
                                                    Please add steps in the
                                                    configuration file
                                                </p>
                                            </div>
                                        )}
                                        {steps.length > 0 &&
                                            steps.map((stepItem, index) => (
                                                <a
                                                    className=""
                                                    key={index}
                                                    onClick={() => {
                                                        setStep(index + 1);
                                                    }}
                                                >
                                                    <li
                                                        key={index}
                                                        className={`mb-10 ml-6 ${
                                                            step === index + 1
                                                                ? "text-green-500"
                                                                : "text-gray-500"
                                                        }`}
                                                    >
                                                        <span
                                                            className={`absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 ring-4 ring-white ${
                                                                step ===
                                                                index + 1
                                                                    ? "bg-green-200"
                                                                    : "bg-white"
                                                            }`}
                                                        >
                                                            {/* TODO Maybe display check if fields are validate in steps  ? */}
                                                            {/*{step === index + 1 ? (*/}
                                                            {/*    <svg*/}
                                                            {/*        aria-hidden="true"*/}
                                                            {/*        className="h-5 w-5 text-green-500 "*/}
                                                            {/*        fill="currentColor"*/}
                                                            {/*        viewBox="0 0 20 20"*/}
                                                            {/*        xmlns="http://www.w3.org/2000/svg"*/}
                                                            {/*    >*/}
                                                            {/*        <path*/}
                                                            {/*            fillRule="evenodd"*/}
                                                            {/*            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"*/}
                                                            {/*            clipRule="evenodd"*/}
                                                            {/*        />*/}
                                                            {/*    </svg>*/}
                                                            {/*) : (*/}
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="white"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                                className="h-6 w-6 text-gray-500"
                                                            >
                                                                {
                                                                    stepItem.svgPath
                                                                }
                                                            </svg>
                                                            {/*)}*/}
                                                        </span>
                                                        <h3 className="font-medium leading-tight">
                                                            {index + 1} -{" "}
                                                            {stepItem.name}
                                                        </h3>
                                                        <p className="text-sm text-gray-500 ">
                                                            {
                                                                stepItem.description
                                                            }
                                                        </p>
                                                    </li>
                                                </a>
                                            ))}
                                    </ol>
                                </div>
                            </div>
                            {/* Form */}
                            <div className="flex w-full flex-col px-5">
                                <h4 className="py-4 text-2xl font-bold ">
                                    <label
                                        htmlFor="name"
                                        className="mb-7 text-lg text-gray-700 md:text-3xl"
                                    >
                                        {steps[step - 1].name}
                                    </label>
                                </h4>

                                {step === 1 && (
                                    <div className="mb-10 ms-5 flex h-full w-full flex-col gap-5">
                                        <div className="mb-2 ms-5 flex flex-col">
                                            <div className="mb-1 flex flex-col">
                                                <label
                                                    htmlFor="applicationName"
                                                    className={
                                                        `pb-1 text-sm font-medium text-gray-700` +
                                                        (!isApplicationNameValid(
                                                            applicationName,
                                                        )
                                                            ? "gray-900 "
                                                            : "red-700 ")
                                                    }
                                                >
                                                    Application Name
                                                </label>
                                                <input
                                                    className={`bg-gray-40 mb-2 block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 ${
                                                        !isApplicationNameValid(
                                                            applicationName,
                                                        )
                                                            ? "border-red-500 bg-red-50 p-2.5 text-sm text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500"
                                                            : ""
                                                    }`}
                                                    id="applicationName"
                                                    name="applicationName"
                                                    type="text"
                                                    value={
                                                        applicationName || ""
                                                    }
                                                    onChange={(e) => {
                                                        applicationNameUpdated(
                                                            e,
                                                        );
                                                    }}
                                                    placeholder="my-first-application"
                                                />
                                                {!isApplicationNameValid(
                                                    applicationName,
                                                ) && (
                                                    <p className="text-sm text-red-500">
                                                        Please enter a valid
                                                        application name and
                                                        check the below rules.
                                                    </p>
                                                )}
                                                {!isApplicationNameAvailableInNamespace() && (
                                                    <p className="text-sm text-red-500">
                                                        This application name is
                                                        already taken in this
                                                        namespace.
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex flex-row items-center gap-2">
                                                <InfoCircledIcon />
                                                <p className="text-sm font-semibold text-gray-500">
                                                    The application name can
                                                    only contain alphanumeric
                                                    characters and hyphens, it
                                                    must be at least 3
                                                    characters long and cannot
                                                    start or end with a hyphen.
                                                </p>
                                            </div>
                                            {applicationName &&
                                                // applicationNamespace &&
                                                isApplicationNameValid(
                                                    applicationName,
                                                ) && (
                                                    // isNamespaceValid(
                                                    //     applicationNamespace,
                                                    // ) &&
                                                    <div className="flex flex-col items-center gap-2">
                                                        {/* Recap of the final URL where the application will be available */}
                                                        <h4 className="pt-12 text-2xl font-bold ">
                                                            Your application
                                                            will be available
                                                            at:
                                                        </h4>
                                                        <a
                                                            className="text-1xl font-semibold leading-normal text-blue-800 "
                                                            href={`https://${applicationName}.${project.name}.${process.env.NEXT_PUBLIC_BASE_CONTAINER_DOMAIN}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                        >
                                                            https://
                                                            {applicationName}.
                                                            {
                                                                applicationNamespace!
                                                                    .name
                                                            }
                                                            .
                                                            {
                                                                process.env
                                                                    .NEXT_PUBLIC_BASE_CONTAINER_DOMAIN
                                                            }
                                                        </a>
                                                        <p className="text-sm font-semibold text-gray-500">
                                                            (This URL will be
                                                            available once you
                                                            have completed the
                                                            next steps)
                                                        </p>
                                                    </div>
                                                )}
                                        </div>
                                        <div className="mb-2 ms-5 mt-6 flex flex-col items-start">
                                            <label
                                                htmlFor="applicationDescription"
                                                className="mb-2 block text-sm font-medium text-gray-900 "
                                            >
                                                Description
                                            </label>
                                            <textarea
                                                className="bg-gray-40 mb-2 block max-h-28 w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 "
                                                id="applicationDescription"
                                                name="applicationDescription"
                                                rows={3}
                                                value={description || ""}
                                                onChange={(e) => {
                                                    applicationDescriptionUpdated(
                                                        e,
                                                    );
                                                }}
                                                placeholder="This is my first application"
                                            />
                                            <div className="flex flex-row items-center gap-2">
                                                <InfoCircledIcon />
                                                <p className="text-sm font-semibold text-gray-500">
                                                    The application description
                                                    is optional and can be
                                                    changed later.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {step === 2 && (
                                    <div className="mb-10 ms-5 flex h-full w-full flex-col">
                                        <div className="mb-2 ms-5 flex flex-col items-start">
                                            {/* Choice between docker and our private registry */}
                                            <label
                                                htmlFor="image-registries"
                                                className="mb-2 block text-sm font-medium text-gray-900 "
                                            >
                                                Select a registry
                                            </label>
                                            <select
                                                id="image-registries"
                                                className="bg-gray-40 mb-2 block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 "
                                                onChange={(e) => {
                                                    setRegistry(
                                                        findRegistryByName(
                                                            e.target
                                                                .value as AvailableContainerRegistriesName,
                                                        ),
                                                    );
                                                }}
                                            >
                                                {availableContainerRegistries.map(
                                                    (registry) => {
                                                        return (
                                                            <option
                                                                key={
                                                                    registry.name
                                                                }
                                                                value={
                                                                    registry.name
                                                                }
                                                            >
                                                                {registry.name}{" "}
                                                                ({registry.url})
                                                            </option>
                                                        );
                                                    },
                                                )}
                                            </select>
                                        </div>
                                        <div className="mb-2 ms-5 flex flex-col gap-1">
                                            <label
                                                htmlFor="image-name"
                                                className={`mb-2 block text-sm font-medium text-gray-900  ${!isImageValid(
                                                    applicationImage,
                                                )}`}
                                            >
                                                Image from {registry.name}
                                            </label>
                                            <input
                                                id="image-name"
                                                name="image-name"
                                                className={`bg-gray-40 mb-2 block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 ${
                                                    !isImageValid(
                                                        applicationImage,
                                                    ) && "border-red-500"
                                                }`}
                                                type="text"
                                                value={applicationImage || ""}
                                                onChange={(e) => {
                                                    applicationImageUpdated(e);
                                                }}
                                                placeholder="organization/my-first-application:latest"
                                            />
                                            {!isImageValid(
                                                applicationImage,
                                            ) && (
                                                <p className="text-sm font-semibold text-red-500">
                                                    The image name is not valid.
                                                    Please verify that the
                                                    format respect the below
                                                    format.
                                                </p>
                                            )}
                                            <div className="flex flex-row items-center gap-2">
                                                <InfoCircledIcon />
                                                <p className="text-sm font-semibold text-gray-500">
                                                    The image name must be in
                                                    the format{" "}
                                                    <code>
                                                        organization/my-first-application:latest
                                                    </code>
                                                </p>
                                            </div>
                                            {applicationImage &&
                                                isImageValid(
                                                    applicationImage,
                                                ) && (
                                                    <>
                                                        <h4 className="pt-8 text-2xl font-bold ">
                                                            The used image is
                                                            stored at:
                                                        </h4>
                                                        <p className="text-1xl font-semibold leading-normal text-blue-800 ">
                                                            <Link
                                                                href={displayImageInRegistryUrl(
                                                                    registry.url,
                                                                    applicationImage,
                                                                    registry.registry,
                                                                    projectId,
                                                                )}
                                                                target="_blank"
                                                            >
                                                                {registry.registry ===
                                                                    "dockerhub" &&
                                                                    displayImageInRegistryUrl(
                                                                        registry.url,
                                                                        applicationImage,
                                                                        registry.registry,
                                                                        projectId,
                                                                    )}
                                                                {registry.registry ===
                                                                    "pcr" && (
                                                                    <>
                                                                        Here,
                                                                        choose
                                                                        the
                                                                        correct
                                                                        namespace
                                                                        according
                                                                        to the
                                                                        image
                                                                    </>
                                                                )}
                                                            </Link>
                                                        </p>
                                                    </>
                                                )}
                                        </div>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="mb-10 ms-5 flex h-full w-full flex-col">
                                        <div>
                                            <p className="font-semi-bold pb-6 ">
                                                We recommend you to define the
                                                port you have defined in the{" "}
                                                <code>$PORT</code> environment
                                                variable of your container.
                                            </p>

                                            <label
                                                htmlFor="port"
                                                // className="mb-2 block text-sm font-medium text-red-700 "
                                                className={
                                                    "mb-2 block text-sm font-medium" +
                                                    (isPortValid(
                                                        applicationPort,
                                                    )
                                                        ? "gray-900 "
                                                        : "red-700 ")
                                                }
                                            >
                                                Port
                                            </label>
                                            <input
                                                id="port"
                                                name="port"
                                                type="number"
                                                className={`bg-gray-40 mb-2 block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500  ${
                                                    !isPortValid(
                                                        applicationPort,
                                                    )
                                                        ? "border-red-500 bg-red-50 p-2.5 text-sm text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 "
                                                        : ""
                                                }`}
                                                value={applicationPort || ""}
                                                onChange={(e: {
                                                    target: {
                                                        value: string;
                                                    };
                                                }) =>
                                                    setApplicationPort(
                                                        parseInt(
                                                            e.target.value,
                                                        ),
                                                    )
                                                }
                                                placeholder="3000"
                                                min="1" // Minimum port number
                                                max="65535" // Maximum port number
                                                required // Mark the field as required
                                            />
                                            {!isPortValid(applicationPort) ? (
                                                <p className="mt-2 text-sm text-red-600 ">
                                                    Please enter a valid port
                                                    number between 1 and 65535.
                                                </p>
                                            ) : null}
                                        </div>
                                    </div>
                                )}
                                {step === 4 && (
                                    <div className="mb-10 ms-5 flex h-full w-full flex-col">
                                        <label
                                            htmlFor="application-type"
                                            className="mb-2 block text-sm font-medium text-gray-900 "
                                        >
                                            Application Type
                                        </label>
                                        <select
                                            id="application-type"
                                            className="bg-gray-40 mb-2 block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 "
                                            value={applicationType}
                                            onChange={(e) =>
                                                setApplicationType(
                                                    e.target
                                                        .value as ContainerApplicationType,
                                                )
                                            }
                                        >
                                            <option value="SINGLE_INSTANCE">
                                                Single Instance
                                            </option>
                                            <option value="LOAD_BALANCED">
                                                Load Balanced
                                            </option>
                                        </select>
                                    </div>
                                )}
                                {step === 5 && (
                                    <div className="mb-10 ms-5 flex h-full w-full flex-col">
                                        <label
                                            htmlFor="cpu-limit"
                                            className="mb-2 block text-sm font-medium text-gray-900 "
                                        >
                                            CPU Limit (milliCPU)
                                        </label>
                                        <select
                                            className="bg-gray-40 mb-2 block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500"
                                            value={applicationCpuLimit}
                                            onChange={(e) =>
                                                setApplicationCpuLimit(
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            {CPU_LIMIT_AVAILABLE_CHOICES.map(
                                                (choice) => (
                                                    <option
                                                        key={`${choice.value}${choice.unit}`}
                                                        value={`${choice.value}${choice.unit}`}
                                                    >
                                                        {choice.value}{" "}
                                                        {choice.unit}
                                                    </option>
                                                ),
                                            )}
                                        </select>
                                        <label
                                            htmlFor="memory-limit"
                                            className="mb-2 mt-3 block text-sm font-medium text-gray-900 "
                                        >
                                            Memory Limit (MB)
                                        </label>
                                        <select
                                            className="bg-gray-40 mb-2 block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 "
                                            value={applicationMemoryLimit}
                                            onChange={(e) =>
                                                setApplicationMemoryLimit(
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            {MEMORY_LIMIT_AVAILABLE_CHOICES.map(
                                                (choice) => (
                                                    <option
                                                        key={`${choice.value}${choice.unit}`}
                                                        value={`${choice.value}${choice.unit}`}
                                                    >
                                                        {choice.value}{" "}
                                                        {choice.unit}
                                                    </option>
                                                ),
                                            )}
                                        </select>
                                    </div>
                                )}
                                {step === 6 &&
                                    applicationType === "LOAD_BALANCED" && (
                                        <div className="mb-10 ms-5 flex h-full w-full flex-col">
                                            <div className="flex flex-col">
                                                <label className="relative inline-flex cursor-pointer items-center">
                                                    <input
                                                        type="checkbox"
                                                        onChange={() => {
                                                            setIsAutoscalingEnabled(
                                                                !isAutoscalingEnabled,
                                                            );
                                                        }}
                                                        className="peer sr-only"
                                                    />
                                                    <div className="peer-focus:ring-3 peer h-7 w-14 rounded-full bg-gray-200 after:absolute after:left-[4px] after:top-0.5 after:h-6 after:w-6 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-green-200 "></div>
                                                    <span className="ml-3 text-sm font-medium text-gray-900 ">
                                                        Enable autoscaling
                                                    </span>
                                                </label>
                                                {/* Display a message that explains the autoscaling feature */}
                                                {isAutoscalingEnabled && (
                                                    <p className="mt-2 text-sm text-gray-500 ">
                                                        Your application will
                                                        automatically scale up
                                                        or down based on the CPU
                                                        and Memory usage and the
                                                        scaling specifications
                                                        you provide bellow.
                                                    </p>
                                                )}
                                                {!isAutoscalingEnabled && (
                                                    <p className="mt-2 text-sm text-gray-500 ">
                                                        You will have to
                                                        manually scale your
                                                        application. We will
                                                        notify you when your
                                                        application is running
                                                        out of resources
                                                        according to the scaling
                                                        specifications you
                                                        provide bellow.
                                                    </p>
                                                )}
                                            </div>
                                            {
                                                <div className="mb-10 ms-5 mt-5 flex flex-col">
                                                    <div className="mb-2 flex flex-col">
                                                        <label
                                                            htmlFor="replicas"
                                                            className={
                                                                "mb-2 block text-sm font-medium" +
                                                                (isReplicasValid(
                                                                    replicas,
                                                                )
                                                                    ? "gray-900 "
                                                                    : "red-700 ")
                                                            }
                                                        >
                                                            Number of Replicas
                                                        </label>
                                                        <input
                                                            id="replicas"
                                                            type="number"
                                                            className={`bg-gray-40 mb-1 block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500  ${
                                                                !isReplicasValid(
                                                                    replicas,
                                                                )
                                                                    ? "border-red-500 bg-red-50 p-2.5 text-sm text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 "
                                                                    : ""
                                                            }`}
                                                            value={
                                                                replicas || ""
                                                            }
                                                            onChange={(e) => {
                                                                updateReplicas(
                                                                    e,
                                                                );
                                                            }}
                                                            placeholder="Enter Number of Replicas"
                                                            min="0"
                                                            max={MAX_REPLICAS}
                                                            required
                                                        />
                                                        {!isReplicasValid(
                                                            replicas,
                                                        ) ? (
                                                            <p className="mt-2 text-sm text-red-600 ">
                                                                Please enter a
                                                                valid number
                                                                between 0 and
                                                                10.
                                                            </p>
                                                        ) : null}
                                                    </div>

                                                    <div className="mb-2 flex flex-col">
                                                        <label
                                                            htmlFor="cpuUsage"
                                                            className={
                                                                "mb-2 block text-sm font-medium" +
                                                                (isCpuUsageThresholdValid(
                                                                    cpuUsageThreshold,
                                                                )
                                                                    ? "gray-900 "
                                                                    : "red-700 ")
                                                            }
                                                        >
                                                            CPU Usage Threshold
                                                            (%)
                                                        </label>
                                                        <input
                                                            id="cpuUsage"
                                                            type="number"
                                                            className={`bg-gray-40 mb-1 block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500  ${
                                                                !isCpuUsageThresholdValid(
                                                                    cpuUsageThreshold,
                                                                )
                                                                    ? "border-red-500 bg-red-50 p-2.5 text-sm text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 "
                                                                    : ""
                                                            }`}
                                                            value={
                                                                cpuUsageThreshold ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                updateCpuUsageThreshold(
                                                                    e,
                                                                )
                                                            }
                                                            placeholder="Enter CPU Usage Threshold"
                                                            min="0"
                                                            max="100"
                                                            required
                                                        />
                                                        {!isCpuUsageThresholdValid(
                                                            cpuUsageThreshold,
                                                        ) ? (
                                                            <p className="mt-2 text-sm text-red-600 ">
                                                                Please enter a
                                                                valid number
                                                                between 0 and
                                                                100.
                                                            </p>
                                                        ) : null}
                                                    </div>

                                                    <div className="mb-2 flex flex-col">
                                                        <label
                                                            htmlFor="memoryUsage"
                                                            className={
                                                                "mb-2 block text-sm font-medium" +
                                                                (isMemoryUsageThresholdValid(
                                                                    memoryUsageThreshold,
                                                                )
                                                                    ? "gray-900 "
                                                                    : "red-700 ")
                                                            }
                                                        >
                                                            Memory Usage
                                                            Threshold (%)
                                                        </label>
                                                        <input
                                                            id="memoryUsage"
                                                            type="number"
                                                            className={`bg-gray-40 mb-1 block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500  ${
                                                                !isMemoryUsageThresholdValid(
                                                                    memoryUsageThreshold,
                                                                )
                                                                    ? "border-red-500 bg-red-50 p-2.5 text-sm text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 "
                                                                    : ""
                                                            }`}
                                                            value={
                                                                memoryUsageThreshold ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                updateMemoryUsageThreshold(
                                                                    e,
                                                                )
                                                            }
                                                            placeholder="Enter Memory Usage Threshold"
                                                            min="0"
                                                            max="100"
                                                            required
                                                        />
                                                        {!isMemoryUsageThresholdValid(
                                                            memoryUsageThreshold,
                                                        ) ? (
                                                            <p className="mt-2 text-sm text-red-600 ">
                                                                Please enter a
                                                                valid number
                                                                between 0 and
                                                                100.
                                                            </p>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    )}
                                {step === 7 && (
                                    <div className="mb-10 ms-5 flex h-full w-full flex-col">
                                        <label
                                            htmlFor="environment-variables"
                                            className="mb-2 block text-sm font-medium text-gray-900 "
                                        >
                                            Environment Variables :
                                        </label>
                                        <div>
                                            {applicationEnvironmentVariables.map(
                                                (variable, index) => (
                                                    <div
                                                        key={index}
                                                        className="mb-2 flex items-center"
                                                    >
                                                        <input
                                                            type="text"
                                                            className="bg-gray-40 mb-2 block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 "
                                                            placeholder="Key"
                                                            value={
                                                                variable.name ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleEnvironmentVariableChange(
                                                                    index,
                                                                    "name",
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                        <span className="mx-2">
                                                            →
                                                        </span>
                                                        <input
                                                            type="text"
                                                            className="bg-gray-40 mb-2 block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 "
                                                            placeholder="Value"
                                                            value={
                                                                variable.value ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleEnvironmentVariableChange(
                                                                    index,
                                                                    "value",
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                        <button
                                                            className="Button stuga-red-color mx-3"
                                                            onClick={() =>
                                                                handleRemoveEnvironmentVariable(
                                                                    index,
                                                                )
                                                            }
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            className="Button stuga-primary-color w-fit"
                                            onClick={
                                                handleAddEnvironmentVariable
                                            }
                                        >
                                            Add Environment Variable
                                        </button>
                                    </div>
                                )}
                                {step === 8 && (
                                    <div className="mb-10 ms-5 flex h-full w-full flex-col">
                                        <label
                                            htmlFor="application-secrets"
                                            className="mb-2 block text-sm font-medium text-gray-900 "
                                        >
                                            Application Secrets
                                        </label>
                                        <div>
                                            {applicationSecrets.map(
                                                (secret, index) => (
                                                    <div
                                                        key={index}
                                                        className="mb-2 flex items-center"
                                                    >
                                                        <input
                                                            type="text"
                                                            className="bg-gray-40 mb-2 block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 "
                                                            placeholder="Key"
                                                            value={
                                                                secret.name ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleSecretChange(
                                                                    index,
                                                                    "name",
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                        <span className="mx-2">
                                                            →
                                                        </span>
                                                        <input
                                                            type="text"
                                                            className="bg-gray-40 mb-2 block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 "
                                                            placeholder="Value"
                                                            value={
                                                                secret.value ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleSecretChange(
                                                                    index,
                                                                    "value",
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                        <button
                                                            className="Button stuga-red-color mx-3"
                                                            onClick={() =>
                                                                handleRemoveSecret(
                                                                    index,
                                                                )
                                                            }
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            className="Button stuga-primary-color w-fit"
                                            onClick={handleAddSecret}
                                        >
                                            Add Secret
                                        </button>
                                    </div>
                                )}
                                {step === 9 && (
                                    <div className="mb-10 ms-5 flex h-full w-full flex-col">
                                        <p className="mb-4 mt-2 text-sm text-gray-500">
                                            The administrator email is used to
                                            receive notifications about the
                                            application scalability.
                                        </p>
                                        <p className="mb-4 mt-2 text-sm text-gray-500">
                                            In manual scaling mode, the
                                            administrator email will receive
                                            notifications when the application
                                            should be scaled up or down.
                                        </p>
                                        <p className="mb-4 mt-2 text-sm text-gray-500">
                                            In automatic scaling mode, the
                                            administrator email will receive
                                            notifications when the application
                                            is scaled up or down automatically.
                                        </p>
                                        <label
                                            htmlFor="admin-email"
                                            className={
                                                "mb-2 block text-sm font-medium" +
                                                (isEmailValid(
                                                    administratorEmail,
                                                )
                                                    ? "gray-900 "
                                                    : "red-700 ")
                                            }
                                        >
                                            Administrator Email
                                        </label>
                                        <input
                                            type="email"
                                            id="admin-email"
                                            name="admin-email"
                                            className={`bg-gray-40 mb-1 block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500  ${
                                                !isEmailValid(
                                                    administratorEmail,
                                                )
                                                    ? "border-red-500 bg-red-50 p-2.5 text-sm text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 "
                                                    : ""
                                            }`}
                                            value={administratorEmail || ""}
                                            onChange={(e) =>
                                                setAdministratorEmail(
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="admin@example.com"
                                            required
                                        />

                                        {!isEmailValid(administratorEmail) ? (
                                            <p className="mt-2 text-sm text-red-600 ">
                                                Please enter a valid email
                                                address.
                                            </p>
                                        ) : null}
                                    </div>
                                )}

                                <div className="flex justify-between">
                                    {step === 1 && (
                                        <button
                                            type="button"
                                            // onClick={}
                                            className="invisible"
                                        />
                                    )}
                                    {step > 1 && (
                                        <button
                                            type="button"
                                            onClick={handlePrevious}
                                            className="Button stuga-orange-color"
                                        >
                                            Previous
                                        </button>
                                    )}
                                    {step < steps.length && (
                                        <button
                                            type="button"
                                            onClick={handleNext}
                                            className="Button stuga-primary-color"
                                        >
                                            Next
                                        </button>
                                    )}
                                    {step === steps.length && (
                                        <button
                                            type="submit"
                                            className="Button stuga-primary-color"
                                        >
                                            Deploy application
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
