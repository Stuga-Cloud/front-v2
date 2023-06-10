export class StugaError extends Error {
    message: string;
    error: string;
    status: number;
    context?: Error;

    constructor({
        message,
        error,
        status,
        context,
    }: {
        message: string;
        error: string;
        status: number;
        context?: Error;
    }) {
        super(message);
        this.message = message;
        this.error = error;
        this.status = status;
        this.context = context;
    }
}

export const InternalServerError = (context?: any) => {
    if (context instanceof Error) {
        return new StugaError({
            message: "An internal server error occurred.",
            error: "internal-server-error",
            context: context,
            status: 500,
        });
    }
    return new StugaError({
        message: "An internal server error occurred.",
        error: "internal-server-error",
        status: 500,
    });
};
