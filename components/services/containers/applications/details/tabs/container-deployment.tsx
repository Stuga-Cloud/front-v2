"use client";
import { Session } from "next-auth";
import { redirect, useRouter } from "next/navigation";
import React, { useState } from "react";
import { Project } from "@/lib/models/project";
import { ContainerApplicationNamespace } from "@/lib/models/containers/container-application-namespace";
import { LoadingSpinner } from "@/components/shared/icons";
import { ContainerRetrieved } from "@/components/services/containers/applications/details/container-details";
import {
    availableContainerRegistries,
    AvailableContainerRegistriesInformation,
    AvailableContainerRegistriesName,
    ContainerCreation,
    findRegistryByName,
    findRegistryByRegistry,
} from "@/components/services/containers/applications/create/container-creation";
import { DisplayToast } from "@/components/shared/toast/display-toast";
import { CreateContainerApplicationBody } from "@/lib/services/containers/create-container-application.body";
import axios from "axios";
import { StugaError } from "@/lib/services/error/error";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import process from "process";
import Link from "next/link";
import { ContainerApplicationType } from "@/lib/models/containers/container-application-type";
import { isEmailValid } from "@/lib/utils";
import {
    cpuLimitsChoices,
    memoryLimitsChoices,
} from "@/lib/models/lambdas/config/lambda-create-config";
import { ContainerLimitUnit } from "@/lib/models/containers/container-application-specifications";
import { ContainerNamespace } from "@/lib/models/containers/prisma/container-namespace";
import { ContainerEnvironmentVariable } from "@/lib/models/containers/container-application-environment-variables";
import { ContainerApplicationSecret } from "@/lib/models/containers/container-application-secrets";

export default function ContainerDeployment({
    session,
    project,
    container,
    namespaceInAPI,
    reloadContainer,
}: {
    session: Session;
    project: Project;
    container: ContainerRetrieved;
    namespaceInAPI: ContainerApplicationNamespace;
    reloadContainer: () => void;
}) {
    if (!session) redirect("/");
    if (!project || !container)
        redirect(`/projects/${project.id}/services/containers`);

    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [applicationNamespace, setApplicationNamespace] =
        useState<ContainerNamespace>(container.container.namespace);
    const [registry, setRegistry] =
        useState<AvailableContainerRegistriesInformation>({
            registry: container.containerInAPI.registry,
            url: findRegistryByRegistry(container.containerInAPI.registry).url,
            name: findRegistryByRegistry(container.containerInAPI.registry)
                .name,
        });
    const [image, setImage] = useState<string | undefined>(
        container.containerInAPI.image,
    );
    const [port, setPort] = useState<number | undefined>(
        container.containerInAPI.port,
    );
    const [applicationType, setApplicationType] =
        useState<ContainerApplicationType>(
            container.containerInAPI.applicationType,
        );
    const [
        applicationEnvironmentVariables,
        setApplicationEnvironmentVariables,
    ] = useState<ContainerEnvironmentVariable[]>(
        container.containerInAPI.environmentVariables,
    );
    const [applicationSecrets, setApplicationSecrets] = useState<
        ContainerApplicationSecret[]
    >(container.containerInAPI.secrets);
    const [applicationCpuLimit, setApplicationCpuLimit] = useState<number>(
        container.containerInAPI.containerSpecifications.cpuLimit.value,
    );
    const [applicationMemoryLimit, setApplicationMemoryLimit] =
        useState<number>(
            container.containerInAPI.containerSpecifications.memoryLimit.value,
        );
    const [isAutoscalingEnabled, setIsAutoscalingEnabled] = useState<boolean>(
        container.containerInAPI.scalabilitySpecifications?.isAutoScaled!,
    );
    const [cpuUsageThreshold, setCpuUsageThreshold] = useState<
        number | undefined
    >(
        container.containerInAPI.scalabilitySpecifications
            ?.cpuUsagePercentageThreshold,
    );
    const [memoryUsageThreshold, setMemoryUsageThreshold] = useState<
        number | undefined
    >(
        container.containerInAPI.scalabilitySpecifications
            ?.memoryUsagePercentageThreshold,
    );
    const [replicas, setReplicas] = useState<number | undefined>(
        container.containerInAPI.scalabilitySpecifications?.replicas,
    );
    const [administratorEmail, setAdministratorEmail] = useState<string>(
        container.containerInAPI.administratorEmail,
    );

    const [containerUpdate, setContainerUpdate] = useState<ContainerCreation>(
        new ContainerCreation({
            applicationName: container.containerInAPI.name,
            applicationNamespace: container.container.namespace,
            description: container.containerInAPI.description ?? "",
            registry: {
                // TODO -> register in db
                registry: container.containerInAPI.registry,
                url: findRegistryByRegistry(container.containerInAPI.registry)
                    .url,
                name: findRegistryByRegistry(container.containerInAPI.registry)
                    .name,
            },
            image: container.containerInAPI.image,
            port: container.containerInAPI.port,
            applicationType: container.containerInAPI.applicationType,
            applicationEnvironmentVariables:
                container.containerInAPI.environmentVariables ?? [],
            applicationSecrets: container.containerInAPI.secrets ?? [],
            applicationCpuLimit:
                container.containerInAPI.containerSpecifications.cpuLimit.value,
            applicationMemoryLimit:
                container.containerInAPI.containerSpecifications.memoryLimit
                    .value,
            isAutoscalingEnabled:
                container.containerInAPI.scalabilitySpecifications
                    ?.isAutoScaled ?? false,
            cpuUsageThreshold:
                container.containerInAPI.scalabilitySpecifications
                    ?.cpuUsagePercentageThreshold ?? 80,
            memoryUsageThreshold:
                container.containerInAPI.scalabilitySpecifications
                    ?.memoryUsagePercentageThreshold ?? 80,
            replicas:
                container.containerInAPI.scalabilitySpecifications?.replicas ??
                1,
            administratorEmail: container.containerInAPI.administratorEmail,
        }),
    );

    const handleKeyDown = (event: any) => {
        if (event.key === "Enter") {
            event.preventDefault();
        }
    };

    const handleSubmit = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        console.log("Container update : ", containerUpdate);
        const errors = containerUpdate.validateForm("update");
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
            const createContainerApplicationBody: CreateContainerApplicationBody =
                {
                    name: containerUpdate.applicationName!,
                    description: containerUpdate.description!,
                    zone: "europe-west-1",
                    image: containerUpdate.image!,
                    registry: containerUpdate.registry.registry,
                    port: containerUpdate.port!,
                    applicationType: containerUpdate.applicationType!,
                    environmentVariables:
                        containerUpdate.applicationEnvironmentVariables,
                    secrets: containerUpdate.applicationSecrets,
                    containerSpecifications: {
                        cpuLimit: {
                            value: containerUpdate.applicationCpuLimit,
                            unit: "mCPU",
                        },
                        memoryLimit: {
                            value: containerUpdate.applicationMemoryLimit,
                            unit: ContainerLimitUnit.MB,
                        },
                    },
                    scalabilitySpecifications: {
                        replicas: containerUpdate.replicas!,
                        memoryUsagePercentageThreshold:
                            containerUpdate.memoryUsageThreshold!,
                        cpuUsagePercentageThreshold:
                            containerUpdate.cpuUsageThreshold!,
                        isAutoScaled: containerUpdate.isAutoscalingEnabled!,
                    },
                    administratorEmail: containerUpdate.administratorEmail!,
                    userId: "",
                    namespaceId: "",
                };
            const updatedContainer = await axios(
                `/api/projects/${project.id}/services/containers/namespaces/${container.container.namespaceId}/applications/${container.container.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    data: createContainerApplicationBody,
                },
            );
            console.log("updatedContainer", updatedContainer);
            DisplayToast({
                type: "success",
                message: `Application ${containerUpdate.applicationName} updated`,
                duration: 5000,
            });
            setLoading(false);
            reloadContainer();
            router.refresh();
        } catch (error: any) {
            setLoading(false);
            console.log("Error while updateing application", error);
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
                message: `Couldn't update application ${containerUpdate.applicationName}, please try again later or contact support`,
                duration: 4000,
            });
        }
    };

    return (
        <>
            {loading && <LoadingSpinner />}
            <div className="z-10 flex w-full flex-col items-center justify-center">
                {loading ? (
                    <div className="flex h-[10vh] items-center justify-center">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        onKeyDown={handleKeyDown}
                        className="flex w-4/5 flex-col"
                    >
                        {/* Place stepper information on left side and form on right side */}
                        <div className="flex w-full flex-row items-start align-middle">
                            {/* Form */}
                            <div className="flex w-full flex-col">
                                <div className="flex h-full w-full flex-col">
                                    <h4 className="py-4 text-lg font-bold text-gray-700 md:text-3xl">
                                        Image
                                    </h4>
                                    <div className="mb-2 flex flex-col items-start">
                                        {/* Choice between docker and our private registry */}
                                        <label
                                            htmlFor="image-registries"
                                            className="mb-2 block text-sm font-medium text-gray-900"
                                        >
                                            Select a registry
                                        </label>
                                        <select
                                            id="image-registries"
                                            className="bg-gray-40 mb-2 block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 "
                                            onChange={(e) => {
                                                containerUpdate.updateRegistry(
                                                    findRegistryByName(
                                                        e.target
                                                            .value as AvailableContainerRegistriesName,
                                                    ),
                                                );
                                                setRegistry(
                                                    findRegistryByName(
                                                        e.target
                                                            .value as AvailableContainerRegistriesName,
                                                    ),
                                                );
                                            }}
                                            value={
                                                containerUpdate.registry.name
                                            }
                                        >
                                            {availableContainerRegistries.map(
                                                (registry) => {
                                                    return (
                                                        <option
                                                            key={registry.name}
                                                            value={
                                                                registry.name
                                                            }
                                                        >
                                                            {registry.name} (
                                                            {registry.url})
                                                        </option>
                                                    );
                                                },
                                            )}
                                        </select>
                                    </div>
                                    <div className="mb-2 flex flex-col gap-1">
                                        <label
                                            htmlFor="image-name"
                                            className={`mb-2 block text-sm font-medium text-gray-900 ${!containerUpdate.isImageValid()}`}
                                        >
                                            Image from{" "}
                                            {containerUpdate.registry.name}
                                        </label>
                                        <input
                                            id="image-name"
                                            name="image-name"
                                            className={`bg-gray-40 mb-2 block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 ${
                                                !containerUpdate.isImageValid() &&
                                                "border-red-500"
                                            }`}
                                            type="text"
                                            value={containerUpdate.image || ""}
                                            onChange={(e) => {
                                                containerUpdate.updateApplicationImage(
                                                    e.target.value,
                                                );
                                                setImage(e.target.value);
                                            }}
                                            placeholder="organization/my-first-application:latest"
                                        />
                                        {!containerUpdate.isImageValid() && (
                                            <p className="text-sm font-semibold text-red-500">
                                                The image name is not valid.
                                                Please verify that the format
                                                respect the below format.
                                            </p>
                                        )}
                                        <div className="flex flex-row items-center gap-2">
                                            <InfoCircledIcon />
                                            <p className="text-sm font-semibold text-gray-500">
                                                The image name must be in the
                                                format{" "}
                                                <code>
                                                    organization/my-first-application:latest
                                                </code>
                                            </p>
                                        </div>
                                        {containerUpdate.image &&
                                            containerUpdate.isImageValid() && (
                                                <>
                                                    <h4 className="pt-8 text-2xl font-bold ">
                                                        The used image is stored
                                                        at:
                                                    </h4>
                                                    <p className="text-1xl font-semibold leading-normal text-blue-800 ">
                                                        <Link
                                                            href={displayImageInRegistryUrl(
                                                                containerUpdate
                                                                    .registry
                                                                    .url,
                                                                containerUpdate.image,
                                                                containerUpdate
                                                                    .registry
                                                                    .registry,
                                                                project.id,
                                                            )}
                                                            target="_blank"
                                                        >
                                                            {registry.registry ===
                                                                "dockerhub" &&
                                                                displayImageInRegistryUrl(
                                                                    registry.url,
                                                                    containerUpdate.image,
                                                                    registry.registry,
                                                                    project.id,
                                                                )}
                                                            {registry.registry ===
                                                                "pcr" && (
                                                                <>
                                                                    Here, choose
                                                                    the correct
                                                                    namespace
                                                                    according to
                                                                    the image
                                                                </>
                                                            )}
                                                        </Link>
                                                    </p>
                                                </>
                                            )}
                                    </div>
                                </div>

                                <div className="mb-10 mt-10 flex h-full w-full flex-col">
                                    <div>
                                        <h4 className="py-4 text-lg font-bold text-gray-700 md:text-3xl">
                                            Port
                                        </h4>
                                        <p className="mb-4 mt-2 text-sm text-gray-500">
                                            We recommend you to define the port
                                            you have defined in the{" "}
                                            <code>$PORT</code> environment
                                            variable of your container.
                                        </p>

                                        <label
                                            htmlFor="port"
                                            // className="mb-2 block text-sm font-medium text-red-700 "
                                            className={
                                                "mb-2 block text-sm font-medium" +
                                                (containerUpdate.isPortValid()
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
                                                !containerUpdate.isPortValid()
                                                    ? "border-red-500 bg-red-50 p-2.5 text-sm text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 "
                                                    : ""
                                            }`}
                                            value={containerUpdate.port || ""}
                                            onChange={(e: {
                                                target: {
                                                    value: string;
                                                };
                                            }) => {
                                                containerUpdate.updatePort(
                                                    parseInt(e.target.value),
                                                );
                                                setPort(
                                                    parseInt(e.target.value),
                                                );
                                            }}
                                            placeholder="3000"
                                            min="1" // Minimum port number
                                            max="65535" // Maximum port number
                                            required // Mark the field as required
                                        />
                                        {!containerUpdate.isPortValid() ? (
                                            <p className="mt-2 text-sm text-red-600 ">
                                                Please enter a valid port number
                                                between 1 and 65535.
                                            </p>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="mb-10 flex h-full w-full flex-col">
                                    <h4 className="py-4 text-lg font-bold text-gray-700 md:text-3xl">
                                        Should your application be scalable ?
                                    </h4>
                                    <label
                                        htmlFor="application-type"
                                        className="mb-2 block text-sm font-medium text-gray-900 "
                                    >
                                        Application Type
                                    </label>
                                    <select
                                        id="application-type"
                                        className="bg-gray-40 mb-2 block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 "
                                        value={containerUpdate.applicationType}
                                        onChange={(e) => {
                                            containerUpdate.updateApplicationType(
                                                e.target
                                                    .value as ContainerApplicationType,
                                            );
                                            setApplicationType(
                                                e.target
                                                    .value as ContainerApplicationType,
                                            );
                                        }}
                                    >
                                        <option value="SINGLE_INSTANCE">
                                            Single Instance
                                        </option>
                                        <option value="LOAD_BALANCED">
                                            Load Balanced
                                        </option>
                                    </select>
                                </div>
                                <div className="mb-10 flex h-full w-full flex-col">
                                    <h4 className="py-4 text-lg font-bold text-gray-700 md:text-3xl">
                                        Container(s) specifications
                                    </h4>
                                    <label
                                        htmlFor="cpu-limit"
                                        className="mb-2 block text-sm font-medium text-gray-900 "
                                    >
                                        CPU Limit (milliCPU)
                                    </label>
                                    <select
                                        className="bg-gray-40 mb-2 block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500"
                                        value={
                                            containerUpdate.applicationCpuLimit
                                        }
                                        onChange={(e) => {
                                            containerUpdate.updateApplicationCpuLimit(
                                                Number(e.target.value),
                                            );
                                            setApplicationCpuLimit(
                                                Number(e.target.value),
                                            );
                                        }}
                                    >
                                        {cpuLimitsChoices.map((choice) => (
                                            <option
                                                key={choice.value}
                                                value={`${choice.value}`}
                                            >
                                                {choice.value} {choice.unit}
                                            </option>
                                        ))}
                                    </select>
                                    <label
                                        htmlFor="memory-limit"
                                        className="mb-2 mt-3 block text-sm font-medium text-gray-900 "
                                    >
                                        Memory Limit (MB)
                                    </label>
                                    <select
                                        className="bg-gray-40 mb-2 block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 "
                                        value={
                                            containerUpdate.applicationMemoryLimit
                                        }
                                        onChange={(e) => {
                                            containerUpdate.updateApplicationMemoryLimit(
                                                Number(e.target.value),
                                            );
                                            setApplicationMemoryLimit(
                                                Number(e.target.value),
                                            );
                                        }}
                                    >
                                        {memoryLimitsChoices.map((choice) => (
                                            <option
                                                key={choice.value}
                                                value={`${choice.value}`}
                                            >
                                                {choice.value} {choice.unit}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {containerUpdate.applicationType ===
                                    "LOAD_BALANCED" && (
                                    <div className="mb-10 flex h-full w-full flex-col">
                                        <h4 className="py-4 text-lg font-bold text-gray-700 md:text-3xl">
                                            Scalability Configuration
                                        </h4>
                                        <div className="flex flex-col">
                                            <label className="relative inline-flex cursor-pointer items-center">
                                                <input
                                                    type="checkbox"
                                                    onChange={() => {
                                                        containerUpdate.updateIsAutoscalingEnabled(
                                                            !containerUpdate.isAutoscalingEnabled,
                                                        );
                                                        setIsAutoscalingEnabled(
                                                            !containerUpdate.isAutoscalingEnabled,
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
                                            {containerUpdate.isAutoscalingEnabled && (
                                                <p className="mt-2 text-sm text-gray-500 ">
                                                    Your application will
                                                    automatically scale up or
                                                    down based on the CPU and
                                                    Memory usage and the scaling
                                                    specifications you provide
                                                    bellow.
                                                </p>
                                            )}
                                            {!containerUpdate.isAutoscalingEnabled && (
                                                <p className="mb-4 mt-2 text-sm text-gray-500">
                                                    You will have to manually
                                                    scale your application. We
                                                    will notify you when your
                                                    application is running out
                                                    of resources according to
                                                    the scaling specifications
                                                    you provide bellow.
                                                </p>
                                            )}
                                        </div>
                                        {
                                            <div className="flex flex-col">
                                                <div className="mb-2 flex flex-col">
                                                    <label
                                                        htmlFor="replicas"
                                                        className={
                                                            "mb-2 block text-sm font-medium" +
                                                            (containerUpdate.isReplicasValid()
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
                                                            !containerUpdate.isReplicasValid()
                                                                ? "border-red-500 bg-red-50 p-2.5 text-sm text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 "
                                                                : ""
                                                        }`}
                                                        value={
                                                            containerUpdate.replicas ||
                                                            ""
                                                        }
                                                        onChange={(e) => {
                                                            containerUpdate.updateReplicas(
                                                                e,
                                                            );
                                                            setReplicas(
                                                                containerUpdate.replicas,
                                                            );
                                                        }}
                                                        placeholder="Enter Number of Replicas"
                                                        min="0"
                                                        max="10"
                                                        required
                                                    />
                                                    {!containerUpdate.isReplicasValid() ? (
                                                        <p className="mt-2 text-sm text-red-600 ">
                                                            Please enter a valid
                                                            number between 0 and
                                                            10.
                                                        </p>
                                                    ) : null}
                                                </div>

                                                <div className="mb-2 flex flex-col">
                                                    <label
                                                        htmlFor="cpuUsage"
                                                        className={
                                                            "mb-2 block text-sm font-medium" +
                                                            (containerUpdate.isCpuUsageThresholdValid()
                                                                ? "gray-900 "
                                                                : "red-700 ")
                                                        }
                                                    >
                                                        CPU Usage Threshold (%)
                                                    </label>
                                                    <input
                                                        id="cpuUsage"
                                                        type="number"
                                                        className={`bg-gray-40 mb-1 block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500  ${
                                                            !containerUpdate.isCpuUsageThresholdValid()
                                                                ? "border-red-500 bg-red-50 p-2.5 text-sm text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 "
                                                                : ""
                                                        }`}
                                                        value={
                                                            containerUpdate.cpuUsageThreshold ||
                                                            ""
                                                        }
                                                        onChange={(e) => {
                                                            containerUpdate.updateCpuUsageThreshold(
                                                                e,
                                                            );
                                                            setCpuUsageThreshold(
                                                                containerUpdate.cpuUsageThreshold,
                                                            );
                                                        }}
                                                        placeholder="Enter CPU Usage Threshold"
                                                        min="0"
                                                        max="100"
                                                        required
                                                    />
                                                    {!containerUpdate.isCpuUsageThresholdValid() ? (
                                                        <p className="mt-2 text-sm text-red-600 ">
                                                            Please enter a valid
                                                            number between 0 and
                                                            100.
                                                        </p>
                                                    ) : null}
                                                </div>

                                                <div className="mb-2 flex flex-col">
                                                    <label
                                                        htmlFor="memoryUsage"
                                                        className={
                                                            "mb-2 block text-sm font-medium" +
                                                            (containerUpdate.isMemoryUsageThresholdValid()
                                                                ? "gray-900 "
                                                                : "red-700 ")
                                                        }
                                                    >
                                                        Memory Usage Threshold
                                                        (%)
                                                    </label>
                                                    <input
                                                        id="memoryUsage"
                                                        type="number"
                                                        className={`bg-gray-40 mb-1 block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500  ${
                                                            !containerUpdate.isMemoryUsageThresholdValid()
                                                                ? "border-red-500 bg-red-50 p-2.5 text-sm text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 "
                                                                : ""
                                                        }`}
                                                        value={
                                                            containerUpdate.memoryUsageThreshold ||
                                                            ""
                                                        }
                                                        onChange={(e) => {
                                                            containerUpdate.updateMemoryUsageThreshold(
                                                                e,
                                                            );
                                                            setMemoryUsageThreshold(
                                                                containerUpdate.memoryUsageThreshold,
                                                            );
                                                        }}
                                                        placeholder="Enter Memory Usage Threshold"
                                                        min="0"
                                                        max="100"
                                                        required
                                                    />
                                                    {!containerUpdate.isMemoryUsageThresholdValid() ? (
                                                        <p className="mt-2 text-sm text-red-600 ">
                                                            Please enter a valid
                                                            number between 0 and
                                                            100.
                                                        </p>
                                                    ) : null}
                                                </div>
                                            </div>
                                        }
                                    </div>
                                )}
                                <div className="mb-10 flex h-full w-full flex-col">
                                    <h4 className="py-4 text-lg font-bold text-gray-700 md:text-3xl">
                                        Environment variables
                                    </h4>
                                    <label
                                        htmlFor="environment-variables"
                                        className="mb-2 block text-sm font-medium text-gray-900 "
                                    >
                                        Environment Variables :
                                    </label>
                                    <div>
                                        {containerUpdate.applicationEnvironmentVariables.map(
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
                                                            variable.name || ""
                                                        }
                                                        onChange={(e) => {
                                                            containerUpdate.handleEnvironmentVariableChange(
                                                                index,
                                                                "name",
                                                                e.target.value,
                                                            );
                                                            setApplicationEnvironmentVariables(
                                                                containerUpdate.applicationEnvironmentVariables,
                                                            );
                                                        }}
                                                    />
                                                    <span className="mx-2">
                                                        →
                                                    </span>
                                                    <input
                                                        type="text"
                                                        className="bg-gray-40 mb-2 block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 "
                                                        placeholder="Value"
                                                        value={
                                                            variable.value || ""
                                                        }
                                                        onChange={(e) => {
                                                            containerUpdate.handleEnvironmentVariableChange(
                                                                index,
                                                                "value",
                                                                e.target.value,
                                                            );
                                                            setApplicationEnvironmentVariables(
                                                                containerUpdate.applicationEnvironmentVariables,
                                                            );
                                                        }}
                                                    />
                                                    <button
                                                        className="Button stuga-red-color mx-3"
                                                        onClick={() => {
                                                            containerUpdate.handleRemoveEnvironmentVariable(
                                                                index,
                                                            );
                                                            setApplicationEnvironmentVariables(
                                                                containerUpdate.applicationEnvironmentVariables,
                                                            );
                                                        }}
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
                                        onClick={() => {
                                            containerUpdate.handleAddEnvironmentVariable();
                                            setApplicationEnvironmentVariables(
                                                containerUpdate.applicationEnvironmentVariables,
                                            );
                                        }}
                                    >
                                        Add Environment Variable
                                    </button>
                                </div>
                                <div className="mb-10 flex h-full w-full flex-col">
                                    <h4 className="py-4 text-lg font-bold text-gray-700 md:text-3xl">
                                        Secrets
                                    </h4>
                                    <label
                                        htmlFor="application-secrets"
                                        className="mb-2 block text-sm font-medium text-gray-900 "
                                    >
                                        Application Secrets
                                    </label>
                                    <div>
                                        {containerUpdate.applicationSecrets.map(
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
                                                            secret.name || ""
                                                        }
                                                        onChange={(e) => {
                                                            containerUpdate.handleSecretChange(
                                                                index,
                                                                "name",
                                                                e.target.value,
                                                            );
                                                            setApplicationSecrets(
                                                                containerUpdate.applicationSecrets,
                                                            );
                                                        }}
                                                    />
                                                    <span className="mx-2">
                                                        →
                                                    </span>
                                                    <input
                                                        type="text"
                                                        className="bg-gray-40 mb-2 block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 "
                                                        placeholder="Value"
                                                        value={
                                                            secret.value || ""
                                                        }
                                                        onChange={(e) => {
                                                            containerUpdate.handleSecretChange(
                                                                index,
                                                                "value",
                                                                e.target.value,
                                                            );
                                                            setApplicationSecrets(
                                                                containerUpdate.applicationSecrets,
                                                            );
                                                        }}
                                                    />
                                                    <button
                                                        className="Button stuga-red-color mx-3"
                                                        onClick={() => {
                                                            containerUpdate.handleRemoveSecret(
                                                                index,
                                                            );
                                                            setApplicationSecrets(
                                                                containerUpdate.applicationSecrets,
                                                            );
                                                        }}
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
                                        onClick={() => {
                                            containerUpdate.handleAddSecret();
                                            setApplicationSecrets(
                                                containerUpdate.applicationSecrets,
                                            );
                                        }}
                                    >
                                        Add Secret
                                    </button>
                                </div>
                                <div className="mb-10 flex h-full w-full flex-col">
                                    <h4 className="py-4 text-lg font-bold text-gray-700 md:text-3xl">
                                        Notifications
                                    </h4>
                                    <p className="mb-4 mt-2 text-sm text-gray-500">
                                        The administrator email is used to
                                        receive notifications about the
                                        application scalability. In manual
                                        scaling mode, the administrator email
                                        will receive notifications when the
                                        application should be scaled up or down.
                                        In automatic scaling mode, the
                                        administrator email will receive
                                        notifications when the application is
                                        scaled up or down automatically.
                                    </p>
                                    <label
                                        htmlFor="admin-email"
                                        className={
                                            "mb-2 block text-sm font-medium" +
                                            (isEmailValid(
                                                containerUpdate.administratorEmail,
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
                                                containerUpdate.administratorEmail,
                                            )
                                                ? "border-red-500 bg-red-50 p-2.5 text-sm text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 "
                                                : ""
                                        }`}
                                        value={
                                            containerUpdate.administratorEmail ||
                                            ""
                                        }
                                        onChange={(e) => {
                                            containerUpdate.updateAdministratorEmail(
                                                e.target.value,
                                            );
                                            setApplicationSecrets(
                                                containerUpdate.applicationSecrets,
                                            );
                                        }}
                                        placeholder="admin@example.com"
                                        required
                                    />

                                    {!isEmailValid(
                                        containerUpdate.administratorEmail,
                                    ) ? (
                                        <p className="mt-2 text-sm text-red-600 ">
                                            Please enter a valid email address.
                                        </p>
                                    ) : null}
                                </div>

                                <button
                                    type="submit"
                                    className="Button stuga-primary-color mt-10"
                                >
                                    Update application
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </>
    );
}

export const displayImageInRegistryUrl = (
    url: string,
    image: string,
    registry: string,
    projectId: string,
) => {
    if (registry === "dockerhub") {
        return `${url}/r/${image.substring(0, image.lastIndexOf(":"))}/tags`;
    }
    if (registry === "pcr") {
        return `/projects/${projectId}/services/registry/`;
    }

    return "you are hacking us? :)";
};
