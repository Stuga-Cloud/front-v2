import { ContainerApplication } from "@/lib/models/containers/container-application";
import { ContainerApplicationNamespaceMembership } from "@/lib/models/containers/container-application-namespace-membership";

export interface ContainerApplicationNamespace {
    id: string;
    name: string;
    description: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    applications: ContainerApplication[];
    memberships: ContainerApplicationNamespaceMembership[];
}
