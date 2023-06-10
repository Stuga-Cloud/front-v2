import { StugaError } from '@/lib/services/error/error';

export class ContainerApplicationAlreadyExistError extends StugaError {
    constructor(message: string) {
        super({
            message,
            error: "container-application-already-exist",
            status: 500,
        });
    }
}
