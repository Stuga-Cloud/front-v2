import { ContainerApplicationNamespace } from "@/lib/models/containers/container-application-namespace";
import { ContainerApplicationEnvironmentVariables } from "@/lib/models/containers/container-application-environment-variables";
import { ContainerApplicationType } from "@/lib/models/containers/container-application-type";
import { ContainerApplicationSecrets } from "@/lib/models/containers/container-application-secrets";
import {
    ContainerApplicationContainerSpecifications,
    CPUContainerLimit,
    MemoryContainerLimit,
} from "@/lib/models/containers/container-application-specifications";
import { ContainerApplicationScalabilitySpecifications } from "@/lib/models/containers/container-application-scalability-specifications";

enum ApplicationStatus {
    // AVAILABLE = "AVAILABLE",
    // PROGRESSING = "PROGRESSING",
    // REPLICA_FAILURE = "REPLICA_FAILURE",
	AVAILABLE         = "AVAILABLE",
	MISSING_REPLICAS  = "MISSING_REPLICAS",
	PROGRESSING       = "PROGRESSING",
	FAILED            = "FAILED",
	NOT_READY         = "NOT_READY",
	UPDATING          = "UPDATING",
}

export type ContainerApplicationStatus = keyof typeof ApplicationStatus;

export interface ContainerApplication {
    id: string;
    name: string;
    description: string;
    image: string;
    registry: "pcr" | "dockerhub";
    userId: string;
    namespaceId: string;
    namespace: ContainerApplicationNamespace;
    port: number;
    zone: string;
    applicationType: ContainerApplicationType;
    environmentVariables: ContainerApplicationEnvironmentVariables;
    secrets: ContainerApplicationSecrets;
    containerSpecifications: ContainerApplicationContainerSpecifications;
    scalabilitySpecifications: ContainerApplicationScalabilitySpecifications | null;
    administratorEmail: string;
    status: ContainerApplicationStatus;
    updatedAt: Date;
    createdAt: Date;
}

export const humanizeContainerCPULimitSpecifications = (
    cpuLimit: CPUContainerLimit,
): string => {
    return `${cpuLimit.value} ${cpuLimit.unit}`;
};

export const humanizeContainerMemoryLimitSpecifications = (
    memoryLimit: MemoryContainerLimit,
): string => {
    return `${memoryLimit.value} ${memoryLimit.unit}`;
};

export const memoryToMB = (memory: string): string => {
    const value = memory.replace(/[a-zA-Z]/g, "");
    const parsedValue = Number.parseFloat(value);
    const unit = memory.replace(/[0-9]/g, "");

    let result = parsedValue;
    if (unit === "B") {
        result = parsedValue / 1024 / 1024;
    }
    if (unit === "KB") {
        result = parsedValue / 1024;
    }
    if (unit === "MB") {
        result = parsedValue;
    }
    if (unit === "GB") {
        result = parsedValue * 1024;
    }
    if (unit === "TB") {
        result = parsedValue * 1024 * 1024;
    }
    return `${result.toFixed(2)}MB`;
}