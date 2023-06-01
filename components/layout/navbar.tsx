"use client";

import Image from "next/image";
import Link from "next/link";
import useScroll from "@/lib/hooks/use-scroll";
import { useSignInModal } from "./sign-in-modal";
import UserDropdown from "./user-dropdown";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import { pathEventEmitter } from "@/lib/event-emitter/path-event-emitter";

export default function NavBar({ session }: { session: Session | null }) {
    const { SignInModal, setShowSignInModal } = useSignInModal();
    const [pathHeader, setPathHeader] = useState("");
    const scrolled = useScroll(50);

    useEffect(() => {
        // Ecoute de l'EventEmitter pour des mises à jour
        pathEventEmitter.on("update", (path: { path: string }) => {
            setPathHeader(path.path);
        });

        // N'oubliez pas de nettoyer en retournant une fonction de désabonnement
        return () => {
            pathEventEmitter.removeAllListeners("update");
        };
    }, []);

    return (
        <>
            <SignInModal />
            <div
                className={`fixed top-0 w-full ${
                    scrolled
                        ? "border-b border-gray-200 bg-white/50 backdrop-blur-xl"
                        : "bg-white/0"
                } z-30 transition-all`}
            >
                <div className="mx-5 flex h-16 max-w-screen-xl items-center justify-between xl:mx-auto">
                    <Link
                        href="/"
                        className="flex items-center font-display text-2xl"
                    >
                        <Image
                            src="/stuga-logo.png"
                            alt="stuga logo"
                            width="30"
                            height="30"
                            className="mr-2 rounded-sm"
                        ></Image>
                        {pathHeader !== "" ? (
                            <p>{pathHeader}</p>
                        ) : (
                            <p>Stuga-cloud</p>
                        )}
                    </Link>
                    <div>
                        {session ? (
                            <UserDropdown session={session} />
                        ) : (
                            <button
                                className="rounded-full border border-black bg-black p-1.5 px-4 text-sm text-white transition-all hover:bg-white hover:text-black"
                                onClick={() => setShowSignInModal(true)}
                            >
                                Sign In
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
