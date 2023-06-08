import { NextResponse } from "next/server";
import { StugaError } from "./error";

export const StugaErrorToNextResponse = (error: StugaError): NextResponse => {
    
    return NextResponse.json(
        {
            error: error.message,
        },
        { status: error.status },
    );
}
