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
