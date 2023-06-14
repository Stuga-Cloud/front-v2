import { StugaError } from "@/lib/services/error/error";

export class RemoveMemberFromContainerNamespaceError extends StugaError {
    constructor(message: string) {
        super({
            message,
            error: "remove-member-from-container-namespace-error",
            status: 500,
        });
    }
}
