import { StugaError } from "@/lib/services/error/error";

export class FindContainerApplicationError extends StugaError {
    constructor(message: string, status?: number) {
        super({
            message,
            error: "find-container-application-error",
            status: status || 500,
        });
    }
}
