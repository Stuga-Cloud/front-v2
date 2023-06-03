import InfoCircledIcon from "@radix-ui/react-icons/dist/InfoCircledIcon";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import PasswordForm from "./password-form";
import LoadingSpinner from "@/components/shared/icons/loading-spinner";
import axios from "axios";
import { toastEventEmitter } from "@/lib/event-emitter/toast-event-emitter";
import { GetAccountInRegistry } from "../services/get-account-in-registry";
import { CreateUserInRegistry } from "../services/create-user";
import { ModifyPassword } from "../services/modify-pasword";
export default function Profile({
    session,
    projectId,
}: {
    session: Session;
    projectId: string;
}) {
    const USERNAME = session.user?.email;
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<{
        user_id: number;
        username: string;
    }>();
    // récupérer le compte dans le registry
    // si pas de compte dire de l'init
    // si un compte on propose de reset le password

    const handleSubmit = async (
        event: React.FormEvent,
        password: string,
        confirmPassword: string,
        oldPassword?: string,
    ) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            toastEventEmitter.emit("pop", {
                type: "danger",
                message: "Passwords do not match!",
                duration: 2000,
            });
        } else {
            try {
                setLoading(true);
                if (!oldPassword) {
                    await CreateUserInRegistry(projectId, password);
                    toastEventEmitter.emit("pop", {
                        type: "success",
                        message: "User created successfully",
                        duration: 2000,
                    });
                    const user = await GetAccountInRegistry(projectId);
                    setUser(user);
                } else {
                    await ModifyPassword(projectId, password, oldPassword);
                    toastEventEmitter.emit("pop", {
                        type: "success",
                        message: "Password modify successfully",
                        duration: 2000,
                    });
                }
            } catch (error) {
                toastEventEmitter.emit("pop", {
                    type: "danger",
                    message: "Error create user or updating password",
                    duration: 2000,
                });
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        setLoading(true);
        GetAccountInRegistry(projectId)
            .then((userReq) => {
                if (userReq) {
                    console.log("user");
                    console.log(userReq);
                    setUser(userReq);
                }
            })
            .catch((error) => {
                if (error.response.status === 500) {
                    toastEventEmitter.emit("pop", {
                        type: "warning",
                        message: "Error while fetching user",
                        duration: 2000,
                    });
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, [projectId]);

    return (
        <div className="flex w-4/5 flex-col justify-start">
            {!loading && !user ? (
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
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                        ></path>
                    </svg>
                    <span className="sr-only">Info</span>
                    <div>
                        <span className="font-medium">INFO</span> You do not yet
                        have an account in the registry. Start by creating your
                        account.
                    </div>
                </div>
            ) : null}
            {loading ? (
                <div className="flex h-[50vh] items-center justify-center">
                    <LoadingSpinner />
                </div>
            ) : (
                <>
                    <h2 className="mb-5 mt-10 w-4/5 text-3xl font-bold">
                        {user ? "Change your access" : "Create your access"}
                    </h2>
                    <PasswordForm
                        userHaveAccount={user ? true : false}
                        handleSubmit={handleSubmit}
                    />
                </>
            )}
        </div>
    );
}
