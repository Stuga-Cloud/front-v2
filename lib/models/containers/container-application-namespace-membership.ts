const enum ContainerNamespaceRole {
    ADMIN = "ADMIN",
    MEMBER = "MEMBER",
}

export type ContainerNamespaceMembershipRole =
    keyof typeof ContainerNamespaceRole;

export interface ContainerApplicationNamespaceMembership {
    id: string;
    userId: string;
    namespaceId: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}
