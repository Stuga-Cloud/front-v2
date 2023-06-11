export interface Step {
    name: string;
    description: string;
    svgPath: any;
}

export interface LambdaCPULimit {
value: number;
    unit: "mCPU" | "CPU";
}

export interface LambdanMemoryLimit {
    value: number;
    unit: "MB" | "GB";
}

export const cpuLimitsChoices: LambdaCPULimit[] = [
    { value: 70, unit: "mCPU" },
    { value: 140, unit: "mCPU" },
    { value: 280, unit: "mCPU" },
    { value: 560, unit: "mCPU" },
    { value: 1120, unit: "mCPU" },
    { value: 1680, unit: "mCPU" },
    { value: 2240, unit: "mCPU" },
];
export const memoryLimitsChoices: LambdanMemoryLimit[] = [
    { value: 128, unit: "MB" },
    { value: 256, unit: "MB" },
    { value: 512, unit: "MB" },
    { value: 1024, unit: "MB" },
    { value: 2048, unit: "MB" },
    { value: 4096, unit: "MB" },
];