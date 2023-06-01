"use client";
import { Session } from "next-auth";
import { useState } from "react";
import RadioButtons from "./select-field";
import { InfoCircledIcon } from "@radix-ui/react-icons";

export default function RegistryForm({ session, projectId }: { session: Session | null, projectId: string }) {
    const [name, setName] = useState("");
    const [visibility, setVisibility] = useState("public");
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (event) => {
        event.preventDefault();
        await fetch(`/api/projects/${projectId}/services/registry`, {
            method: "POST",
            body: JSON.stringify({ name, visibility }),
        });
    };
    return (
        <div className="w-5/5 z-10 flex flex-col items-center justify-center">
            <h1 className="mb-20 md:text-5xl">Create a namespace</h1>
            <form onSubmit={handleSubmit} className="flex w-4/5 flex-col">
                <label
                    htmlFor="name"
                    className="mb-5 text-lg text-gray-700 md:text-3xl"
                >
                    1 - Choose your namespace
                </label>

                <div className="ms-5 flex w-full flex-col mb-20">
                    <div className="mb-2 ms-5 flex flex-row items-center">
                        <p className="font-bold">
                            https://registry-cloud.machavoine.fr/
                        </p>
                        <input
                            className="ms-5 rounded-md border-2 border-orange-300 px-3 py-2 text-lg text-gray-700 placeholder-gray-600 focus:border-orange-700 focus:outline-none"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your namespace here"
                        />
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        <InfoCircledIcon />
                        <p className="text-sm text-gray-500">
                            The namespace name can only contain alphanumeric
                            characters and hyphens
                        </p>
                    </div>
                </div>

                <label
                    htmlFor="name"
                    className="mb-5 text-lg text-gray-700 md:text-3xl"
                >
                    2 - Private registry or public ?
                </label>
                <div className="ms-5 flex w-full flex-col">
                    <RadioButtons onChange={setVisibility} />
                    <div className=" mt-5 flex flex-row items-center  gap-2">
                        <InfoCircledIcon />
                        <p className="text-sm text-gray-500">
                            Images in a public namespace can be retrieved by
                            anyones
                        </p>
                    </div>
                </div>
                <button
                    type="submit"
                    className="mt-20 rounded bg-orange-300 px-4 py-2 text-center font-bold text-white hover:bg-orange-700 "
                >
                    Create
                </button>
            </form>
        </div>
    );
}
