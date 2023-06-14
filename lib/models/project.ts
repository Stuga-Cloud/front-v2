import { Member } from "@/lib/models/member";
import { ContainerNamespace } from "@/lib/models/containers/prisma/container-namespace";

const enum Role {
    ADMIN = "ADMIN",
    MEMBER = "MEMBER",
}

export type ProjectMembershipRole = keyof typeof Role;

export interface Project {
    id: string;
    name: string;
    members: Member[];
    containerNamespaces: ContainerNamespace[];
    createdBy: string;
}
