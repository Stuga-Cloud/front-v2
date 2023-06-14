import { StugaError } from "@/lib/services/error/error";

export class ContainerNamespaceNotFoundError extends StugaError {
    constructor(message: string) {
        super({
            message,
            error: "container-namespace-not-found",
            status: 404,
        });
    }
}
