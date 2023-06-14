import { ContainerApplication } from "@/lib/models/containers/container-application";

export interface ContainerApplicationNamespace {
    id: string;
    name: string;
    description: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    applications: ContainerApplication[];
}
