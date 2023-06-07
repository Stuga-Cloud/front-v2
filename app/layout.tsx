/* eslint-disable @next/next/no-sync-scripts */
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import cx from "classnames";
import { inter, sfPro } from "./fonts";
import Nav from "@/components/layout/nav";
import Footer from "@/components/layout/footer";
import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

// export const metadata = {
//     title: "Precedent - Building blocks for your Next.js project",
//     description:
//         "Precedent is the all-in-one solution for your Next.js project. It includes a design system, authentication, analytics, and more.",
//     twitter: {
//         card: "summary_large_image",
//         title: "Precedent - Building blocks for your Next.js project",
//         description:
//             "Precedent is the all-in-one solution for your Next.js project. It includes a design system, authentication, analytics, and more.",
//         creator: "@steventey",
//     },
//     metadataBase: new URL("https://precedent.dev"),
//     themeColor: "#FFF",
// };

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);
    return (
        <html lang="en">
            <body
                className={cx(sfPro.variable, inter.variable)}
                suppressHydrationWarning={true}
            >
                <div className="fixed h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-100" />
                <Suspense fallback="...">
                    <Nav session={session} />
                </Suspense>
                <main className="flex min-h-screen w-full flex-col py-32">
                    {children}
                </main>
                <Footer />
                <Analytics />
            </body>
        </html>
    );
}
