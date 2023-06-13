"use client";
import {
    Close,
    Description,
    Dialog,
    DialogContent,
    DialogTrigger,
    Overlay,
    Portal,
    Title,
} from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import axios from "axios";
import { Session } from "next-auth";
import { useState } from "react";
import ServicePopUpCard from "./service-popup-card";

export default function NewService({
    session,
    afterCreate,
    alreadyHave,
    ariaHidden,
}: {
    session: Session | null;
    afterCreate: (
        service: "registry" | "lambda" | "container" | "database",
    ) => void;
    alreadyHave: ("registry" | "lambda" | "container" | "database" | null)[];
    ariaHidden: (opened: boolean) => void;
}) {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        try {
            setLoading(true);
            await axios.post("/api/services", { name });
            setName("");
            setLoading(false);
            setOpen(false);
        } catch (error) {
            setLoading(false);
        }
    };
    return (
        <Dialog
            open={open}
            onOpenChange={() => {
                setOpen(!open);
                ariaHidden(!open);
            }}
        >
            <DialogTrigger asChild>
                <button className="Button stuga-primary-color">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentcolor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4.5v15m7.5-7.5h-15"
                        ></path>
                    </svg>
                    New service
                </button>
            </DialogTrigger>
            <Portal className="z-20">
                <Overlay className="DialogOverlay" />
                <DialogContent className="DialogContent z-10">
                    <Title className="DialogTitle">New Service</Title>
                    <Description className="DialogDescription">
                        Create container registry, lambdas, containers, and
                        secure database.
                    </Description>
                    <div className="grid grid-cols-2 items-center gap-4">
                        {!alreadyHave.includes("registry") && (
                            <ServicePopUpCard
                                title="Container Registry"
                                description="A collection of repositories made to store container images."
                                onClick={() => afterCreate("registry")}
                            />
                        )}
                        {!alreadyHave.includes("lambda") && (
                            <ServicePopUpCard
                                title="Lambdas"
                                description="Functions that can be executed on demand."
                                onClick={() => afterCreate("lambda")}
                            />
                        )}
                        {!alreadyHave.includes("container") && (
                            <ServicePopUpCard
                                title="Containers"
                                description="Deploy containers on demand (API, Web, Worker, DB etc)."
                                onClick={() => afterCreate("container")}
                            />
                        )}
                        {!alreadyHave.includes("database") && (
                            <ServicePopUpCard
                                title="Database"
                                description="Secure database to store your data."
                                onClick={() => afterCreate("database")}
                            />
                        )}
                    </div>
                    <Close asChild>
                        <button
                            type="submit"
                            className="IconButton"
                            aria-label="Close"
                        >
                            <Cross2Icon />
                        </button>
                    </Close>
                </DialogContent>
            </Portal>
        </Dialog>
    );
}
