import { NextResponse } from "next/server";

class ResponseService {
    static success(json: Record<string, any>, init?: ResponseInit) {
        return NextResponse.json(json, init);
    }

    static created(json: Record<string, any>, init?: ResponseInit) {
        return NextResponse.json(json, { ...init, status: 201 });
    }

    static unauthorized(message = "Unauthorized", init?: ResponseInit) {
        return NextResponse.json({ error: message }, { ...init, status: 401 });
    }

    static notFound(message = "Not found", init?: ResponseInit) {
        return NextResponse.json({ error: message }, { ...init, status: 404 });
    }

    static methodNotAllowed(
        message = "Method Not Allowed",
        init?: ResponseInit,
    ) {
        return NextResponse.json({ error: message }, { ...init, status: 405 });
    }

    static internalServerError(
        message = "Internal Server Error",
        init?: ResponseInit,
    ) {
        return NextResponse.json({ error: message }, { ...init, status: 500 });
    }

    static conflict(message = "Conflict", init?: ResponseInit) {
        return NextResponse.json({ error: message }, { ...init, status: 409 });
    }
}

=======
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

    static unauthorized(
        message = "Unauthorized",
        errorContext?: Error,
        init?: ResponseInit,
    ) {
        let errorBody: ErrorBody = { error: message };
        if (process.env.NODE_ENV === "development") {
            errorBody = {
                context: errorContext?.stack ?? "no context",
                ...errorBody,
            };
        }
        return NextResponse.json(errorBody, { ...init, status: 401 });
    }

    static notFound(
        message = "Not found",
        errorContext?: Error,
        init?: ResponseInit,
    ) {
        let errorBody: ErrorBody = { error: message };
        if (process.env.NODE_ENV === "development") {
            errorBody = {
                context: errorContext?.stack ?? "no context",
                ...errorBody,
            };
        }
        return NextResponse.json(errorBody, { ...init, status: 404 });
    }

    static methodNotAllowed(
        message = "Method Not Allowed",
        errorContext?: Error,
        init?: ResponseInit,
    ) {
        let errorBody: ErrorBody = { error: message };
        if (process.env.NODE_ENV === "development") {
            errorBody = {
                context: errorContext?.stack ?? "no context",
                ...errorBody,
            };
        }
        return NextResponse.json(errorBody, { ...init, status: 405 });
    }

    static internalServerError(
        message = "Internal Server Error",
        errorContext?: any,
        init?: ResponseInit,
    ) {
        let errorBody: ErrorBody = { error: message };
        if (process.env.NODE_ENV === "development") {
            if (errorContext instanceof Error) {
                errorBody = {
                    context: errorContext.stack,
                    ...errorBody,
                };
            }
        }
        return NextResponse.json(errorBody, { ...init, status: 500 });
    }
}

export default ResponseService;
