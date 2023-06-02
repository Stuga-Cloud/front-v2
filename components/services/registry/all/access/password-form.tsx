import LoadingSpinner from "@/components/shared/icons/loading-spinner";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import React, { useState } from "react";

export default function PasswordForm({
    password,
    projectId,
    namespaceId,
}: {
    password: string;
    projectId: string;
    namespaceId: string;
}) {
    const [passwordForm, setPasswordForm] = useState(password);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const USERNAME = "remygt@hotmail.fr";

    const handlePasswordChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setPasswordForm(event.target.value);
    };

    const handleConfirmPasswordChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setConfirmPassword(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (passwordForm !== confirmPassword) {
            alert("Passwords do not match!");
        } else {
            setLoading(true);
            await fetch(
                `/api/projects/${projectId}/services/registry/${namespaceId}`,
                {
                    method: "PUT",
                    body: JSON.stringify({ passwordForm }),
                },
            );
            setLoading(false);
        }
    };

    return (
        <div className="ms-5 flex w-4/5 items-center ">
            {loading ? (
                <div className="flex h-[50vh] items-center justify-center">
                    <LoadingSpinner />
                </div>
            ) : (
                <form
                    onSubmit={handleSubmit}
                    className="mt-10 flex w-full flex-col"
                >
                    <label
                        htmlFor="name"
                        className="mb-5 text-lg text-gray-700 md:text-2xl"
                    >
                        1 - Your username
                    </label>

                    <div className="mb-20 ms-5 flex w-full flex-col">
                        <div className="mb-2 flex flex-row items-center">
                            <p className="font-bold">{USERNAME}</p>
                        </div>
                        <div className="flex flex-row items-center gap-2">
                            <InfoCircledIcon />
                            <p className="text-sm text-gray-500">
                                Your username is your email you can't modify it
                            </p>
                        </div>
                    </div>
                    <label
                        htmlFor="name"
                        className="mb-5 text-lg text-gray-700 md:text-2xl"
                    >
                        2 - Password
                    </label>
                    <input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={handlePasswordChange}
                        className="mb-4 w-full rounded-lg bg-white px-3 py-2 text-gray-700 shadow-sm focus:border-lime-800 focus:shadow-lg focus:outline-none"
                    />
                    <label
                        htmlFor="name"
                        className="mb-5 text-lg text-gray-700 md:text-2xl"
                    >
                        3 - Confirm Password
                    </label>
                    <input
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        className="focus:shadow-outline mb-4 w-full rounded-lg bg-white px-3 py-2 text-gray-700 shadow-sm focus:outline-none"
                    />
                    <button
                        type="submit"
                        className="focus:shadow-outline w-full rounded-lg bg-green-700 px-3 py-2 text-white shadow-sm hover:bg-green-800 focus:outline-none"
                    >
                        Validate
                    </button>
                </form>
            )}
        </div>
    );
}
