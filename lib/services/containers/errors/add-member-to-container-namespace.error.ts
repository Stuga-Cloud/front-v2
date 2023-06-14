import { StugaError } from "@/lib/services/error/error";

export class AddMemberToContainerNamespaceError extends StugaError {
    constructor(message: string) {
        super({
            message,
            error: "add-member-to-container-namespace-error",
            status: 500,
        });
    }
}
