import { StugaError } from "@/lib/services/error/error";

export class UpdateContainerApplicationError extends StugaError {
    constructor(message: string) {
        super({
            message,
            error: "update-container-application-error",
            status: 500,
        });
    }
}
