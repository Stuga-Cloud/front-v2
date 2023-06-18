import { NextResponse } from "next/server";

interface ErrorBody {
    error: string;
    context?: string;
}

class ResponseService {
    static success(json: Record<string, any>, init?: ResponseInit) {
        return NextResponse.json(json, init);
    }

    static created(json: Record<string, any>, init?: ResponseInit) {
        return NextResponse.json(json, { ...init, status: 201 });
    }

    static updated(json: Record<string, any>, init?: ResponseInit) {
        return NextResponse.json(json, { ...init, status: 200 });
    }

    static badRequest(
        message = "Bad Request",
        errorContext?: any,
        init?: ResponseInit,
    ) {
        let errorBody: ErrorBody = { error: message };
        if (this.hasToDisplayErrorContext(errorContext)) {
            errorBody = {
                context: errorContext.stack,
                ...errorBody,
            };
        }
        return NextResponse.json(errorBody, { ...init, status: 400 });
    }

    static unauthorized(
        message = "Unauthorized",
        errorContext?: any,
        init?: ResponseInit,
    ) {
        let errorBody: ErrorBody = { error: message };
        if (this.hasToDisplayErrorContext(errorContext)) {
            errorBody = {
                context: errorContext.stack,
                ...errorBody,
            };
        }
        return NextResponse.json(errorBody, { ...init, status: 401 });
    }

    static notFound(
        message = "Not found",
        errorContext?: any,
        init?: ResponseInit,
    ) {
        let errorBody: ErrorBody = { error: message };
        if (this.hasToDisplayErrorContext(errorContext)) {
            errorBody = {
                context: errorContext.stack,
                ...errorBody,
            };
        }
        return NextResponse.json(errorBody, { ...init, status: 404 });
    }

    static methodNotAllowed(
        message = "Method Not Allowed",
        errorContext?: any,
        init?: ResponseInit,
    ) {
        let errorBody: ErrorBody = { error: message };
        if (this.hasToDisplayErrorContext(errorContext)) {
            errorBody = {
                context: errorContext.stack,
                ...errorBody,
            };
        }
        return NextResponse.json(errorBody, { ...init, status: 405 });
    }

    static conflict(
        message = "Conflict",
        errorContext?: any,
        init?: ResponseInit,
    ) {
        let errorBody: ErrorBody = { error: message };
        if (this.hasToDisplayErrorContext(errorContext)) {
            errorBody = {
                context: errorContext.stack,
                ...errorBody,
            };
        }

        return NextResponse.json({ error: message }, { ...init, status: 409 });
    }

    static internalServerError(
        message = "Internal Server Error",
        errorContext?: any,
        init?: ResponseInit,
    ) {
        let errorBody: ErrorBody = { error: message };
        if (this.hasToDisplayErrorContext(errorContext)) {
            errorBody = {
                context: errorContext.stack,
                ...errorBody,
            };
        }
        return NextResponse.json(errorBody, { ...init, status: 500 });
    }

    private static hasToDisplayErrorContext(errorContext?: any) {
        return (
            process.env.NODE_ENV === "development" &&
            errorContext instanceof Error
        );
    }
}

export default ResponseService;
