import { NextRequest } from "next/server";

export async function POST(request: Request, { params }: NextRequest) {
    // we will use params to access the data passed to the dynamic route
    const req = await request.json()
    console.log(req);
    console.log(params.user);
    return new Response(`Welcome to my Next application, user:`);
}
