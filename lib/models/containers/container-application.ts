import { ContainerNamespace } from "@/lib/models/containers/container-namespace";
import { ContainerApplicationEnvironmentVariables } from "@/lib/models/containers/container-application-environment-variables";
import { ContainerApplicationType } from "@/lib/models/containers/container-application-type";
import { ContainerApplicationSecrets } from "@/lib/models/containers/container-application-secrets";
import { ContainerApplicationContainerSpecifications } from "@/lib/models/containers/container-application-specifications";
import { ContainerApplicationScalabilitySpecifications } from "@/lib/models/containers/container-application-scalability-specifications";

export interface ContainerApplication {
    id: string;
    name: string;
    description: string;
    image: string;
    userId: string;
    namespaceId: string;
    namespace?: ContainerNamespace | null;
    port: number;
    zone: string;
    applicationType: ContainerApplicationType;
    environmentVariables: ContainerApplicationEnvironmentVariables;
    secrets: ContainerApplicationSecrets;
    containerSpecifications: ContainerApplicationContainerSpecifications;
    scalabilitySpecifications: ContainerApplicationScalabilitySpecifications | null;
    administratorEmail: string;
    status: string;
    updatedAt: Date;
    createdAt: Date;
}
