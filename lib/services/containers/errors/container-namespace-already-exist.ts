import { StugaError } from "@/lib/services/error/error";

export class ContainerNamespaceAlreadyExistError extends StugaError {
    constructor(message: string) {
        super({
            message,
            error: "container-namespace-already-exist",
            status: 409,
        });
    }
}
