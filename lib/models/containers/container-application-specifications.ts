export enum ContainerLimitUnit {
    KB = "KB",
    MB = "MB",
    GB = "GB",
}

export interface MemoryContainerLimit {
    value: number;
    unit: ContainerLimitUnit;
}

export interface CPUContainerLimit {
    value: number;
    unit: "mCPU";
}

export interface ContainerApplicationContainerSpecifications {
    cpuLimit: CPUContainerLimit;
    memoryLimit: MemoryContainerLimit;
    // ephemeralStorageLimit: ContainerLimit;
}
