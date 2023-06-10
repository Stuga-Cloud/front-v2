export enum ContainerLimitUnit {
    KB = "KB",
    MB = "MB",
    GB = "GB",
}

export interface ContainerLimit {
    value: number;
    unit: ContainerLimitUnit;
}

export interface CPUContainerLimit {
    value: number;
    unit: "mCPU";
}

export interface ContainerApplicationContainerSpecifications {
    cpuLimit: CPUContainerLimit;
    memoryLimit: ContainerLimit;
    // ephemeralStorageLimit: ContainerLimit;
}
