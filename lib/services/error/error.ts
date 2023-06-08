export class StugaError extends Error {
    message: string;
    error: string;
    status: number;

    constructor({
        message,
        error,
        status,
    }: {
        message: string;
        error: string;
        status: number;
    }) {
        super(message);
        this.message = message;
        this.error = error;
        this.status = status;
    }
}

export const InternalServerError = new StugaError({
    message: "An internal server error occurred.",
    error: "internal-server-error",
    status: 500,
});
