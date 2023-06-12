import { Lambda } from "@prisma/client";
import { LambdaCPULimit, Registry } from "./lambda-create";
import {
    LambdaMemoryLimit,
    LambdaVisibility,
} from "@/lib/models/lambdas/lambda-create";
import {
    cpuLimitsChoices,
    memoryLimitsChoices,
} from "./config/lambda-create-config";

export interface LambdaModel {
    id: string;
    name: string;
    imageName: string;
    cpuLimit: LambdaCPULimit;
    memoryLimit: LambdaMemoryLimit;
    registry: Registry;
    environmentVariables: { key: string; value: string }[];
    confidentiality: LambdaVisibility;
    minInstanceNumber: number;
    maxInstanceNumber: number;
    timeout: number;
}

export class LambdaModelMapper {
    public static fromRepositoryLambda(lambda: Lambda): LambdaModel {
        const lambdaCPULimit = cpuLimitsChoices.find(
            (cpu) => cpu.value === lambda.cpuLimitmCPU,
        )!;

        const lambdaMemeoryLimit: LambdaMemoryLimit = memoryLimitsChoices.find(
            (memory) => memory.value === lambda.memoryLimitMB,
        )!;

        const privateConfig:
            | {
                  mode: "apiKey" | "jwt";
                  apiKey?: string | undefined;
                  jwt?: string | undefined;
              }
            | undefined = lambda.privateConfig;

        const confidentiality: LambdaVisibility = {
            visibility: (lambda.visibility as "public" | "private") ?? "public",
            access: privateConfig,
        };

        return {
            id: lambda.id,
            name: lambda.name,
            imageName: lambda.imageName,
            cpuLimit: lambdaCPULimit,
            registry: lambda.registry as Registry,
            memoryLimit: lambdaMemeoryLimit,
            environmentVariables: lambda.envVars.map((envVar) => {
                const envVarConvert = envVar as { key: string; value: string };
                return {
                    key: envVarConvert.key,
                    value: envVarConvert.value,
                };
            }),
            confidentiality: confidentiality,
            minInstanceNumber: lambda.minInstances,
            maxInstanceNumber: lambda.maxInstances,
            timeout: lambda.timeoutSeconds,
        };
    }
}
