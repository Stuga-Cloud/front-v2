import { Registry } from "@/lib/models/lambdas/lambda-create";
import { ContainerApplicationType } from "@/lib/models/containers/container-application-type";
import { ContainerEnvironmentVariable } from "@/lib/models/containers/container-application-environment-variables";
import { ContainerApplicationSecret } from "@/lib/models/containers/container-application-secrets";
import process from "process";
import { DisplayToast } from "@/components/shared/toast/display-toast";
import { ContainerNamespace } from "@/lib/models/containers/prisma/container-namespace";
import { isEmailValid } from "@/lib/utils";
import { CPU_LIMIT_AVAILABLE_CHOICES, MAX_REPLICAS, MEMORY_LIMIT_AVAILABLE_CHOICES } from "./new-container-form";

export type AvailableContainerRegistriesName =
    | "Docker hub"
    | "Our private registry";

export const availableContainerRegistries: AvailableContainerRegistriesInformation[] =
    [
        {
            name: "Docker hub",
            url:
                process.env.NEXT_PUBLIC_DOCKER_HUB_URL ||
                "missing docker hub url!",
            registry: "dockerhub",
        },
        {
            name: "Our private registry",
            url:
                process.env.NEXT_PUBLIC_PRIVATE_REGISTRY_URL ||
                "missing private registry url!",
            registry: "pcr",
        },
    ];

export const findRegistryByRegistry = (
    findingRegistry: Registry,
): AvailableContainerRegistriesInformation => {
    const foundRegistry = availableContainerRegistries.find((registry) => registry.registry === findingRegistry)
    if (
        foundRegistry
    ) {
        return foundRegistry;
    }
    DisplayToast({
        type: "error",
        message: `Registry ${findingRegistry} not found`,
        duration: 5000,
    });
    return availableContainerRegistries[0];
}

export const findRegistryByName = (
    name: AvailableContainerRegistriesName,
): AvailableContainerRegistriesInformation => {
    const foundRegistry = availableContainerRegistries.find((registry) => registry.name === name)
    if (
        foundRegistry
    ) {
        return foundRegistry;
    }
    DisplayToast({
        type: "error",
        message: `Registry ${name} not found`,
        duration: 5000,
    });
    return availableContainerRegistries[0];
};

export interface ApplicationCPULimit {
    value: number;
    unit: "mCPU" | "CPU";
}

export interface ApplicationMemoryLimit {
    value: number;
    unit: "MB" | "GB";
}

export interface AvailableContainerRegistriesInformation {
    name: AvailableContainerRegistriesName;
    registry: Registry;
    url: string;
}

export class ContainerCreation {
    applicationName: string | undefined;
    applicationNamespace: ContainerNamespace;
    description: string;
    registry: AvailableContainerRegistriesInformation;
    image: string | undefined;
    port: number | undefined;
    applicationType: ContainerApplicationType;
    applicationEnvironmentVariables: ContainerEnvironmentVariable[];
    applicationSecrets: ContainerApplicationSecret[];
    applicationCpuLimit: number;
    applicationMemoryLimit: number;
    isAutoscalingEnabled: boolean;
    cpuUsageThreshold: number | undefined;
    memoryUsageThreshold: number | undefined;
    replicas: number | undefined;
    administratorEmail: string;
    private stringInSubdomainRegex = new RegExp(
        "^[a-z0-9]([-a-z0-9]*[a-z0-9])?$",
    );
    private keyVarsMessage =
        "Invalid environment variable name, please use only letters, numbers and underscores and start with a letter or underscore";

    constructor({
        applicationName,
        applicationNamespace,
        description,
        registry,
        image,
        port,
        applicationType,
        applicationEnvironmentVariables,
        applicationSecrets,
        applicationCpuLimit,
        applicationMemoryLimit,
        isAutoscalingEnabled,
        cpuUsageThreshold,
        memoryUsageThreshold,
        replicas,
        administratorEmail,
    }: {
        applicationName: string;
        applicationNamespace: ContainerNamespace;
        description: string;
        registry: AvailableContainerRegistriesInformation;
        image: string;
        port: number;
        applicationType: ContainerApplicationType;
        applicationEnvironmentVariables: ContainerEnvironmentVariable[];
        applicationSecrets: ContainerApplicationSecret[];
        applicationCpuLimit: number;
        applicationMemoryLimit: number;
        isAutoscalingEnabled: boolean;
        cpuUsageThreshold: number;
        memoryUsageThreshold: number;
        replicas: number;
        administratorEmail: string;
    }) {
        this.applicationName = applicationName;
        this.applicationNamespace = applicationNamespace;
        this.description = description;
        this.registry = registry;
        this.image = image;
        this.port = port;
        this.applicationType = applicationType;
        this.applicationEnvironmentVariables = applicationEnvironmentVariables;
        this.applicationSecrets = applicationSecrets;
        this.applicationCpuLimit = applicationCpuLimit;
        this.applicationMemoryLimit = applicationMemoryLimit;
        this.isAutoscalingEnabled = isAutoscalingEnabled;
        this.cpuUsageThreshold = cpuUsageThreshold;
        this.memoryUsageThreshold = memoryUsageThreshold;
        this.replicas = replicas;
        this.administratorEmail = administratorEmail;
    }

    public isApplicationNameAvailableInNamespace() {
        if (!this.applicationName || !this.applicationNamespace) return true;
        return !this.applicationNamespace.containers.some(
            (application) => application.name === this.applicationName,
        );
    }

    public applicationNameUpdated(name: string) {
        this.applicationName = name;
    }

    public applicationDescriptionUpdated(description: string) {
        this.description = description;
    }

    public isApplicationNameValid(): boolean {
        return (
            this.applicationName == undefined ||
            (this.applicationName.length > 0 &&
                this.stringInSubdomainRegex.test(this.applicationName))
        );
    }

    public updateRegistry(registry: AvailableContainerRegistriesInformation) {
        this.registry = registry;
    }

    public isImageValid() {
        return (
            this.image == undefined ||
            (this.image.length > 0 &&
                this.image.includes("/") &&
                this.image.includes(":") &&
                this.image[this.image.length - 1] !== ":" &&
                this.image[this.image.length - 1] !== "/")
        );
    }

    public isPortValid() {
        return this.port == undefined || (this.port >= 1 && this.port <= 65535);
    }

    public updatePort(port: number) {
        this.port = port;
    }

    public updateApplicationType(applicationType: ContainerApplicationType) {
        this.applicationType = applicationType;
    }

    public updateApplicationCpuLimit(applicationCpuLimit: number) {
        this.applicationCpuLimit = applicationCpuLimit;
    }

    public updateApplicationMemoryLimit(applicationMemoryLimit: number) {
        this.applicationMemoryLimit = applicationMemoryLimit;
    }

    public updateIsAutoscalingEnabled(isAutoscalingEnabled: boolean) {
        this.isAutoscalingEnabled = isAutoscalingEnabled;
    }

    public updateApplicationImage(image: string) {
        this.image = image;
    }

    public validateEnvironmentVariableOrSecretKey(
        key: string,
        vars: ContainerEnvironmentVariable[] | ContainerApplicationSecret[],
        type: "environment variable" | "secret",
    ) {
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
                message: this.keyVarsMessage,
            });
            return false;
        }
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key)) {
            DisplayToast({
                type: "error",
                message: this.keyVarsMessage,
            });
            return false;
        }
        return true;
    }

    public handleEnvironmentVariableChange(
        index: number,
        whereToChange: "name" | "value",
        value: string,
    ) {
        if (whereToChange === "name") {
            if (
                !this.validateEnvironmentVariableOrSecretKey(
                    value,
                    this.applicationEnvironmentVariables,
                    "environment variable",
                )
            ) {
                return;
            }
        }
        const newEnvironmentVariables = [
            ...this.applicationEnvironmentVariables,
        ];
        newEnvironmentVariables[index][whereToChange] = value;
        this.applicationEnvironmentVariables = newEnvironmentVariables;
    }

    public handleRemoveEnvironmentVariable(index: number) {
        const newEnvironmentVariables = [
            ...this.applicationEnvironmentVariables,
        ];
        newEnvironmentVariables.splice(index, 1);
        this.applicationEnvironmentVariables = newEnvironmentVariables;
    }

    public handleAddEnvironmentVariable() {
        const newEnvironmentVariables = [
            ...this.applicationEnvironmentVariables,
        ];
        newEnvironmentVariables.push({ name: "", value: "" });
        this.applicationEnvironmentVariables = newEnvironmentVariables;
    }

    public handleSecretChange(
        index: number,
        whereToChange: "name" | "value",
        value: string,
    ) {
        if (whereToChange === "name") {
            if (
                !this.validateEnvironmentVariableOrSecretKey(
                    value,
                    this.applicationSecrets,
                    "secret",
                )
            ) {
                return;
            }
        }
        const newSecrets = [...this.applicationSecrets];
        newSecrets[index][whereToChange] = value;
        this.applicationSecrets = newSecrets;
    }

    public handleRemoveSecret(index: number) {
        const newSecrets = [...this.applicationSecrets];
        newSecrets.splice(index, 1);
        this.applicationSecrets = newSecrets;
    }

    public handleAddSecret() {
        const newSecrets = [...this.applicationSecrets];
        newSecrets.push({ name: "", value: "" });
        this.applicationSecrets = newSecrets;
    }

    public updateReplicas(e: any) {
        const removeFirstZeros = e.target.value.replace(/^0+/, "");
        const numberOfReplicas = parseInt(removeFirstZeros);
        this.replicas = numberOfReplicas;
    }

    public updateCpuUsageThreshold(e: any) {
        const removeFirstZeros = e.target.value.replace(/^0+/, "");
        const cpuUsageThreshold = parseInt(removeFirstZeros);
        this.cpuUsageThreshold = cpuUsageThreshold;
    }

    public updateMemoryUsageThreshold(e: any) {
        const removeFirstZeros = e.target.value.replace(/^0+/, "");
        const memoryUsageThreshold = parseInt(removeFirstZeros);
        this.memoryUsageThreshold = memoryUsageThreshold;
    }

    public isReplicasValid() {
        return (
            this.replicas == undefined ||
            (this.replicas >= 1 && this.replicas <= MAX_REPLICAS)
        );
    }

    public isCPULimitValid() {
        return (
            this.applicationCpuLimit == undefined ||
            CPU_LIMIT_AVAILABLE_CHOICES.map((choice) => choice.value).includes(
                this.applicationCpuLimit,
            )
        );
    }

    public isMemoryLimitValid() {
        return (
            this.applicationMemoryLimit == undefined ||
            MEMORY_LIMIT_AVAILABLE_CHOICES.map((choice) => choice.value).includes(
                this.applicationMemoryLimit,
            )
        );
    }

    public isCpuUsageThresholdValid(): boolean {
        return (
            this.cpuUsageThreshold == undefined ||
            (this.cpuUsageThreshold >= 0 && this.cpuUsageThreshold <= 100)
        );
    }

    public isMemoryUsageThresholdValid(): boolean {
        return (
            this.memoryUsageThreshold == undefined ||
            (this.memoryUsageThreshold >= 0 && this.memoryUsageThreshold <= 100)
        );
    }

    private doesntContainDuplicates(
        array: ContainerApplicationSecret[] | ContainerEnvironmentVariable[],
    ): boolean {
        const names = array.map((item) => item.name);
        return names.every((name, index) => names.indexOf(name) === index);
    };


    public isEnvironmentVariablesValid() {
        return this.applicationEnvironmentVariables.every(
            (envVar) =>
                envVar.name.length > 0 
                && !envVar.name.includes(" ") 
                && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(envVar.name)
        ) && this.doesntContainDuplicates(this.applicationEnvironmentVariables);
    }

    public isSecretsValid() {
        return this.applicationSecrets.every(
            (secret) =>
                secret.name.length > 0
                && !secret.name.includes(" ")
                && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(secret.name)
        ) && this.doesntContainDuplicates(this.applicationSecrets);
    }
    
    public updateAdministratorEmail(email: string) {
        this.administratorEmail = email;
    }

    public validateForm(action: "create" | "update") {
        const errors: string[] = [];
        if (!this.applicationName || !this.isApplicationNameValid()) {
            errors.push("Application name is not valid");
        }
        if (
            action == "create" &&
            !this.isApplicationNameAvailableInNamespace()
        ) {
            errors.push(
                "Application name is not available in this namespace, please choose another one",
            );
        }
        if (!this.port || !this.isPortValid()) {
            errors.push(
                "Application port is not valid, it should be between 1 and 65535",
            );
        }
        if (
            !this.administratorEmail ||
            !isEmailValid(this.administratorEmail)
        ) {
            errors.push(
                "Application email is not valid, please use a valid email",
            );
        }
        if (!this.image || !this.isImageValid()) {
            errors.push(
                "Application image is not valid, please use the format: <registry>/<image>:<tag>",
            );
        }
        if (!this.isReplicasValid()) {
            errors.push("Replicas is not valid, it should be between 1 and 10");
        }
        if (!this.isCPULimitValid()) {
            errors.push("CPU limit is not valid");
        }
        if (!this.isMemoryLimitValid()) {
            errors.push("Memory limit is not valid");
        }
        if (!this.isCpuUsageThresholdValid()) {
            errors.push(
                "CPU usage threshold is not valid, it should be >= 0 and <= 100",
            );
        }
        if (!this.isMemoryUsageThresholdValid()) {
            errors.push(
                "Memory usage threshold is not valid, it should be >= 0 and <= 100",
            );
        }
        if (!this.isEnvironmentVariablesValid()) {
            errors.push("Environment variables are not valid (name should not be empty and contain only letters, numbers and underscores and start with a letter or underscore, also, there should not be duplicates)");
        }
        if (!this.isSecretsValid()) {
            errors.push("Secrets are not valid (name should not be empty and contain only letters, numbers and underscores and start with a letter or underscore, also, there should not be duplicates)");
        }
        return errors;
    }
}
