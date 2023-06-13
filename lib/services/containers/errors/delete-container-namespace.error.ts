import { StugaError } from "@/lib/services/error/error";

export class DeleteContainerNamespaceError extends StugaError {
    constructor(message: string) {
        super({
            message,
            error: "delete-container-namespace-error",
            status: 500,
        });
    }
}
