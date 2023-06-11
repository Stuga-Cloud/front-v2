"use client";

import useScroll from "@/lib/hooks/use-scroll";
import { useSignInModal } from "./sign-in-modal";
import UserDropdown from "./user-dropdown";
import { Session } from "next-auth";
import { Breadcrumb, BreadcrumbItem } from "../shared/breadcrumb";

export default function NavBar({
    session,
    breadcrumbItems,
}: {
    session: Session | null;
    breadcrumbItems: BreadcrumbItem[];
}) {
    const { SignInModal, setShowSignInModal } = useSignInModal();
    const scrolled = useScroll(50);

    return (
        <>
            <SignInModal />
            <div
                className={`fixed top-0 w-full ${
                    scrolled
                        ? "border-b border-gray-200 bg-white/50 backdrop-blur-xl"
                        : "bg-white/0"
                } z-20 transition-all`}
            >
                <div className="mx-5 flex h-16 max-w-screen-xl items-center justify-end xl:mx-auto">
                    <Breadcrumb items={breadcrumbItems} />
                    <div >
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
