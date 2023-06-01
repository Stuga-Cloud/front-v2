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
}: {
    session: Session | null;
    afterCreate: (
        service: "registry" | "lambda" | "container" | "database",
    ) => void;
}) {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await axios.post("/api/services", { name });
            setName("");
            setLoading(false);
            setOpen(false);
            await afterCreate();
        } catch (error) {
            setLoading(false);
        }
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="Button stuga-primary-color">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 4v16m8-8H4"
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
                        <ServicePopUpCard
                            title="Container Registry"
                            onClick={() => afterCreate("registry")}
                        />
                        <ServicePopUpCard
                            title="Lambdas"
                            onClick={() => afterCreate("lambda")}
                        />
                        <ServicePopUpCard
                            title="Containers"
                            onClick={() => afterCreate("container")}
                        />
                        <ServicePopUpCard
                            title="Database"
                            onClick={() => afterCreate("database")}
                        />
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
