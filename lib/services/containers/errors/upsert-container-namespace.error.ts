import { StugaError } from "@/lib/services/error/error";

export class UpsertContainerNamespaceError extends StugaError {
    constructor(message: string) {
        super({
            message,
            error: "upsert-container-namespace-error",
            status: 500,
        });
    }
}
