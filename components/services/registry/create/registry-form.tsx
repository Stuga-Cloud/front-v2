"use client";
import { Session } from "next-auth";
import { useState } from "react";
import RadioButtons from "./select-field";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import LoadingSpinner from "@/components/shared/icons/loading-spinner";
import { toastEventEmitter } from "@/lib/event-emitter/toast-event-emitter";
import { useRouter } from "next/navigation";
import { DisplayToast } from "@/components/shared/toast/display-toast";

export default function RegistryForm({
    session,
    projectId,
}: {
    session: Session | null;
    projectId: string;
}) {
    const [name, setName] = useState("");
    const [visibility, setVisibility] = useState("public");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const handleSubmit = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        try {
            setLoading(true);
            await fetch(`/api/projects/${projectId}/services/registry`, {
                method: "POST",
                body: JSON.stringify({ name, visibility }),
            });
            // toastEventEmitter.emit("pop", {
            //     type: "success",
            //     message: "Namespace created",
            //     duration: 4000,
            // });
            DisplayToast({
                type: "success",
                message: "Namespace created",
                duration: 4000,
            });
            router.push(`/projects/${projectId}/services/registry`);
        } catch (error) {
            // toastEventEmitter.emit("pop", {
            //     type: "danger",
            //     message: "error when try to create namespace",
            //     duration: 4000,
            // });
            DisplayToast({
                type: "error",
                message: "error when try to create namespace",
                duration: 4000,
            });
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            {loading && (
                <div className="flex h-[10vh] items-center justify-center">
                    <LoadingSpinner />
                </div>
            )}
            <div className="w-5/5 z-10 flex flex-col items-center justify-center px-5">
                <h1 className="mb-4 py-5 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
                    Create a{" "}
                    <mark className="rounded bg-green-400 px-2 text-white">
                        namespace
                    </mark>
                </h1>
                <p className="pb-10 text-lg font-normal text-gray-500 lg:text-xl">
                    Store your images in our registry organized by namespaces.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="flex w-4/5 flex-col py-10"
                >
                    <label
                        htmlFor="name"
                        className="mb-5 text-lg text-gray-700 md:text-3xl"
                    >
                        1 - Choose your namespace
                    </label>

                    <div className="mb-20 ms-5 flex w-full flex-col">
                        <div className="mb-2 ms-5 flex flex-row items-center">
                            <p className="font-bold">
                                https://registry-cloud.machavoine.fr/
                            </p>
                            <input
                                className="ms-5 rounded-md border-2 border-green-300 px-3 py-2 text-lg text-gray-700 placeholder-gray-600 focus:border-green-700 focus:outline-none"
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
                        className="mt-20 rounded bg-green-400 px-4 py-2 text-center font-bold text-white hover:bg-orange-700 "
                    >
                        Create
                    </button>
                </form>
            </div>
        </>
    );
}
