import { StugaError } from "@/lib/services/error/error";

export class UnauthorizedToAccessNamespaceError extends StugaError {
    constructor(message: string) {
        super({
            message,
            error: "unauthorized-to-access-namespace-error",
            status: 403,
        });
    }
}
