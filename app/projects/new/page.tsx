"use client"
import { Dialog, DialogContent, DialogTrigger, Root } from "@radix-ui/react-dialog";
import axios from "axios";
import { Session } from "next-auth";
import { useState } from "react";

export default function NewProject({ session }: { session: Session | null }) {
    console.log(session);
    const [name, setName] = useState("");

    const handleSubmit = async (form) => {
        form.preventDefault();
        try {
            await axios.post("/api/projects", JSON.stringify({ name }));
            setName("");
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <>
            <Root>
                <DialogTrigger className="z-10" asChild>Create new project</DialogTrigger>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <label>
                            Project name:
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </label>
                        <button type="submit">Submit</button>
                    </form>
                </DialogContent>
            </Root>
        </>
    );
}
