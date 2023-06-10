import { StugaError } from '@/lib/services/error/error';

export class UpsertContainerNamespaceError extends StugaError {
    constructor(message: string) {
        super({
            message,
            error: "get-container-namespace-error",
            status: 500,
        });
    }
}
