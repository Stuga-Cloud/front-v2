"use client";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    Portal,
    Root,
    Overlay,
    Title,
    Description,
    Close,
} from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import axios from "axios";
import { Session } from "next-auth";
import { useState } from "react";
import LoadingDots from "../shared/icons/loading-dots";

export default function NewProject({ session, afterCreate }: { session: Session | null, afterCreate: () => Promise<void> }) {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [open , setOpen] = useState(false);


    const handleSubmit = async (e) => {
        console.log("submit");
        console.log(e);
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post("/api/projects", { name });
            setName("");
            setLoading(false);
            setOpen(false);
            await afterCreate();
        } catch (error) {
            setLoading(false);
            console.error("il y'a eu une erreur");
            console.error(error);
        }
    };
    return (
        <Dialog open={open} onOpenChange={setOpen} >
            <DialogTrigger asChild>
                <button className="Button violet flex h-12 items-center gap-2 ">
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
                    Create new project
                </button>
            </DialogTrigger>
            <Portal className="z-20">
                <Overlay className="DialogOverlay" />
                <DialogContent className="DialogContent z-10">
                    <Title className="DialogTitle">New Project</Title>
                    <Description className="DialogDescription">
                        Create your project with a unique name
                    </Description>
                    {/* <form onSubmit={handleSubmit}>
                            <label>
                                Project name:
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </label>
                            <button type="submit">Submit</button>
                        </form> */}

                    <fieldset className="Fieldset">
                        <label className="Label" htmlFor="name">
                            Name
                        </label>
                        <input
                            className="Input"
                            id="name"
                            defaultValue="Project 1"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </fieldset>
                    <div
                        style={{
                            display: "flex",
                            marginTop: 25,
                            justifyContent: "flex-end",
                        }}
                    >
                        <button
                            className="Button green"
                            onClick={(e) => handleSubmit(e)}
                        >
                            {loading ? (
                                <LoadingDots color="#808080" />
                            ) : (
                                "Save changes"
                            )}
                        </button>
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
