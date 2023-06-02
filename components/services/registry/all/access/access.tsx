import InfoCircledIcon from "@radix-ui/react-icons/dist/InfoCircledIcon";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import PasswordForm from "./password-form";
export default function Access({ session }: { session: Session }) {
    const USERNAME = session.user?.email;
    const [password, setPassword] = useState("Musculation9!");
    // récupérer le compte dans le registry
    // si pas de compte dire de l'init
    // si un compte on propose de reset le password
    const handleAccountInRegistry = async () => {};

    const handleSubmit = async () => {};

    useEffect(() => {});
    return (
        <div className="flex w-4/5 flex-col justify-start">
            <div
                className="mb-4 flex rounded-lg border border-blue-300 bg-blue-50 p-4 text-sm text-blue-800 dark:border-blue-800 dark:bg-gray-800 dark:text-blue-400"
                role="alert"
            >
                <svg
                    aria-hidden="true"
                    className="mr-3 inline h-5 w-5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clip-rule="evenodd"
                    ></path>
                </svg>
                <span className="sr-only">Info</span>
                <div>
                    <span className="font-medium">INFO</span> If it's your first
                    connection the modification will create your account
                </div>
            </div>
            <h2 className="mb-5 mt-10 w-4/5 text-3xl font-bold">
                Change your access
            </h2>
            <PasswordForm password={password} />
        </div>
    );
}
