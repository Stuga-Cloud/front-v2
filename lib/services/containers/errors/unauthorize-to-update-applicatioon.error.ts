import { StugaError } from "@/lib/services/error/error";

export class UnauthorizedToUpdateApplicationError extends StugaError {
    constructor(message: string) {
        super({
            message,
            error: "unauthorized-to-update-application-error",
            status: 403,
        });
    }
}
