import { Container } from "@/lib/models/containers/prisma/container";

export interface ContainerNamespace {
    id: string;
    name: string;
    modifiedAt: Date;
    createdAt: Date;
    projectId: string;
    idInAPI: string;
    containers: Container[];
}
