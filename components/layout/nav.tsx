"use client";
import Navbar from "./navbar";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
    PayloadToastEventEmitter,
    toastEventEmitter,
} from "@/lib/event-emitter/toast-event-emitter";
import { useEffect, useState } from "react";
import Toast from "../shared/toast/toast";
import { Session } from "next-auth";

export default function Nav({ session }: { session: Session | null }) {
    const [toast, setToast] = useState(
        {} as PayloadToastEventEmitter & { visible: boolean },
    );

    useEffect(() => {
        toastEventEmitter.on("pop", (toast) => {
            setToast({ ...toast, visible: true });
            setTimeout(() => {
                setToast({ ...toast, visible: false });
            }, toast.duration);
        });

        return () => {
            toastEventEmitter.removeAllListeners("pop");
        };
    }, []);
    return (
        <>
            {toast.visible && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    duration={(toast.duration ?? 10000)}
                ></Toast>
            )}
            <Navbar session={session} />
            );
        </>
    );
}
