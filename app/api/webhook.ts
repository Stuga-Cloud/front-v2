
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { NextRequest } from "next/server";
import ResponseService from "@/lib/next-response";
import Stripe from 'stripe';

export const config = {
  api: {
    bodyParser: false,
  }
}

export async function post(request: NextRequest) {
  const session = await getServerSession(authOptions);
  // we will use params to access the data passed to the dynamic route
  const authStripe = new Stripe(process.env.STRIPE_KEY!, {
    apiVersion: "2022-11-15",
  });
  const req = await request.json();

  console.log(session, authStripe, req);

  return ResponseService.success({ message: "string" });
}
