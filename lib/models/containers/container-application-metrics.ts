export interface ContainerApplicationMetrics {
    podName: string;
    cpuUsage: string;
    maxCpuUsage: string;
    memoryUsage: string;
    maxMemoryUsage: string;
    ephemeralStorageUsage: string;
    maxEphemeralStorage: string;
    pods: string;
}
