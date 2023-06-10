import { StugaError } from '@/lib/services/error/error';

export class CreateContainerApplicationError extends StugaError {
    constructor(message: string) {
        super({
            message,
            error: "create-container-application-error",
            status: 500,
        });
    }
}
