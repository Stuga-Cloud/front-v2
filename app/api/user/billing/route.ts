import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ResponseService from "@/lib/next-response";
import { isConnected } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import Stripe from "stripe";
import { ProjectParam } from "types/param";

function computePrice(userId: string): number {
    return 1_222;
}

export async function POST(req: NextRequest, { params }: ProjectParam) {
    const session = await getServerSession(authOptions);

    const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
        apiVersion: "2022-11-15",
    });

    if (!isConnected(session)) {
        return ResponseService.unauthorized();
    }

    const price = computePrice(session.user.id);

    const stripeSession = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [
            {
                price: price, // priceId on stripe ?
                // For metered billing, do not pass quantity
                quantity: 1,
            },
        ],
        // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
        // the actual Session ID is returned in the query parameter when your customer
        // is redirected to the success page.
        success_url:
            "https://example.com/success.html?session_id={CHECKOUT_SESSION_ID}",
        cancel_url: "https://example.com/canceled.html",
    });
}
