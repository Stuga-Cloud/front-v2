export interface Step {
    name: string;
    description: string;
    svgPath: any;
}

export interface LambdaCPULimit {
    value: number;
    unit: "mCPU" | "CPU";
}

export interface LambdaMemoryLimit {
    value: number;
    unit: "MB" | "GB";
}

export interface LambdaEnvironmentVariable {
    name: string;
    value: string;
}

export type Registry = "dockerhub" | "pcr";

export interface LambdaVisibility {
    visibility: "public" | "private";
    access?: {
        mode: "apiKey" | "jwt";
        apiKey?: string;
        jwt?: string;
    };
}

export interface LambdaCreateCandidate {
    name: string;
    imageName: string;
    cpuLimit: LambdaCPULimit;
    memoryLimit: LambdaMemoryLimit;
    registry: Registry;
    environmentVariables: {key: string, value: string}[];
    confidentiality: LambdaVisibility;
    minInstanceNumber: number;
    maxInstanceNumber: number;
    timeout: number;
}
