import { ContainerNamespace } from "@/lib/models/containers/prisma/container-namespace";

export interface Container {
    id: string;
    name: string;
    modifiedAt: Date;
    createdAt: Date;
    namespaceId: string;
    idInAPI: string;
    namespace: ContainerNamespace;
}
