export interface Namespace {
    id: string;
    name: string;
    createdAt: string;
    modifiedAt: string;
    state: "public" | "private";
    registryId: string;
}