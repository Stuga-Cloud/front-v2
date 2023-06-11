import { StugaError } from "@/lib/services/error/error";

export class FindContainerNamespaceError extends StugaError {
    constructor(message: string) {
        super({
            message,
            error: "get-container-namespace-error",
            status: 500,
        });
    }
}
