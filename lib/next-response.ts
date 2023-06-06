import { NextResponse } from "next/server";

class ResponseService {
  static success(json: Record<string, any>, init?: ResponseInit) {
    return NextResponse.json(json, init);
  }

  static created(json: Record<string, any>, init?: ResponseInit) {
    return NextResponse.json(json, { ...init, status: 201 });
  }

  static unauthorized(message = 'Unauthorized', init?: ResponseInit) {
    return NextResponse.json({ error: message }, { ...init, status: 401 });
  }

  static notFound(message = 'Not found', init?: ResponseInit) {
    return NextResponse.json({ error: message }, { ...init, status: 404 });
  }

  static methodNotAllowed(message = 'Method Not Allowed', init?: ResponseInit) {
    return NextResponse.json({ error: message }, { ...init, status: 405 });
  }

  static internalServerError(message = 'Internal Server Error', init?: ResponseInit) {
    return NextResponse.json({ error: message }, { ...init, status: 500 });
  }
}


export default ResponseService;
