"use client";
import Navbar from "./navbar";
import {
    PayloadToastEventEmitter,
    toastEventEmitter,
} from "@/lib/event-emitter/toast-event-emitter";
import { useEffect, useState } from "react";
import Toast from "../shared/toast/toast";
import { Session } from "next-auth";
import { BreadcrumbItem } from "../shared/breadcrumb";

export default function Nav({ session, breadcrumbItems }: { session: Session | null, breadcrumbItems: BreadcrumbItem[] }) {
    const [toast, setToast] = useState(
        {} as PayloadToastEventEmitter & { visible: boolean },
    );

    useEffect(() => {
        toastEventEmitter.on("pop", (toast) => {
            console.log("emet un toast")
            console.log(toast)
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
            <Navbar session={session} breadcrumbItems={breadcrumbItems} />
            );
        </>
    );
}
