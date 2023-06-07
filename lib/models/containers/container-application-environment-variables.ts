export interface ContainerEnvironmentVariable {
    name: string;
    value: string;
}

export type ContainerApplicationEnvironmentVariables =
    ContainerEnvironmentVariable[];
