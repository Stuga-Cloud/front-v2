import { ContainerApplicationType } from "@/lib/models/containers/container-application-type";
import { ContainerApplicationEnvironmentVariables } from "@/lib/models/containers/container-application-environment-variables";
import { ContainerApplicationSecrets } from "@/lib/models/containers/container-application-secrets";
import { ContainerApplicationContainerSpecifications } from "@/lib/models/containers/container-application-specifications";
import { ContainerApplicationScalabilitySpecifications } from "@/lib/models/containers/container-application-scalability-specifications";
import { Registry } from "@/lib/models/lambdas/lambda-create";

export interface CreateContainerApplicationBody {
    name: string;
    description: string;
    image: string;
    registry: Registry;
    userId: string;
    namespaceId: string;
    port: number;
    zone: string;
    applicationType: ContainerApplicationType;
    environmentVariables: ContainerApplicationEnvironmentVariables;
    secrets: ContainerApplicationSecrets;
    containerSpecifications: ContainerApplicationContainerSpecifications;
    scalabilitySpecifications: ContainerApplicationScalabilitySpecifications | null;
    administratorEmail: string;
}
