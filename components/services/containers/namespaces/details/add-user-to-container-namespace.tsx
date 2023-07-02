import axios from "axios";
import React, { useState } from "react";
import { Project } from "@/lib/models/project";
import { DisplayToast } from "@/components/shared/toast/display-toast";
import { ContainerNamespaceMembershipRole } from "@/lib/models/containers/container-application-namespace-membership";
import { CloseIcon } from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";
import { isEmailValid } from "@/lib/utils";
import { LoadingSpinner } from "@/components/shared/icons";

export default function AddUserToContainerNamespace({
    project,
    namespaceId,
    afterAddedMember,
    user,
}: {
    project: Project;
    namespaceId: string;
    afterAddedMember: () => void;
    user: any;
}) {
    const [email, setEmail] = useState<string | undefined>(undefined);
    const [role, setRole] =
        useState<ContainerNamespaceMembershipRole>("MEMBER");
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const openModal = () => {
        setShowModal(true);
        setEmail(undefined);
        setRole("MEMBER");
    };
    const closeModal = () => {
        setShowModal(false);
        setEmail(undefined);
        setRole("MEMBER");
    };

    const handleSubmit = async (e: any) => {
        if (email === user.email) {
            DisplayToast({
                type: "error",
                message: "You are already a member of this namespace.",
            });
            return;
        }

        if (!email || !isEmailValid(email)) {
            DisplayToast({
                type: "error",
                message: "Please enter a valid email address.",
            });
            return;
        }

        if (!role) {
            DisplayToast({
                type: "error",
                message: "Please select a role for this user.",
            });
            return;
        }

        if (!project.members.find((member) => member.email === email)) {
            DisplayToast({
                type: "error",
                message:
                    "This user is not a member of this project. Please add them to the project first.",
            });
            return;
        }

        closeModal();
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post(
                `/api/projects/${project.id}/services/containers/namespaces/${namespaceId}/members`,
                {
                    email,
                    role,
                },
            );
            setEmail("");
            setLoading(false);
            closeModal();
            await afterAddedMember();
        } catch (error: any) {
            setLoading(false);
            console.error(error);
            if (error.response.status === 409) {
                DisplayToast({
                    type: "error",
                    message: "This user is already a member of this namespace.",
                });
                return;
            }
            DisplayToast({
                type: "error",
                message:
                    "Something went wrong. Please try again later or contact support.",
            });
        }
    };

    return (
        <>
            {loading && <LoadingSpinner />}
            <button
                type="button"
                className="Button stuga-primary-color"
                onClick={() => openModal()}
            >
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
                New member
            </button>
            {showModal ? (
                <>
                    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
                        <div className="relative mx-auto my-6 w-4/5">
                            <div className="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
                                {/* Do not reload when submitting the form */}
                                <form>
                                    {/*header*/}
                                    <div className="flex items-start justify-between rounded-t border-b border-solid border-slate-200 p-5">
                                        <h3 className="text-3xl font-semibold">
                                            New member
                                        </h3>
                                        <button
                                            className="float-right ml-auto border-0 p-1 text-3xl font-semibold leading-none text-black outline-none focus:outline-none"
                                            onClick={() => closeModal()}
                                        >
                                            <span className="block h-6 w-6 bg-transparent text-2xl text-black outline-none focus:outline-none">
                                                <CloseIcon />
                                            </span>
                                        </button>
                                    </div>
                                    {/*body*/}
                                    <div className="relative flex-auto p-6">
                                        <p className="my-4 text-lg leading-relaxed text-gray-600">
                                            Add a new member to the namespace.
                                        </p>
                                        <fieldset className="Fieldset">
                                            <div className="mb-10 ms-5 flex flex-col">
                                                <label
                                                    htmlFor="admin-email"
                                                    className={
                                                        "mb-2 block text-sm font-medium" +
                                                        (isEmailValid(email)
                                                            ? "gray-900"
                                                            : "red-700")
                                                    }
                                                >
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    id="admin-email"
                                                    name="admin-email"
                                                    className={`bg-gray-40 mb-1 block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 ${
                                                        !isEmailValid(email)
                                                            ? "border-red-500 bg-red-50 p-2.5 text-sm text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 "
                                                            : ""
                                                    }`}
                                                    value={email || ""}
                                                    onChange={(e) =>
                                                        setEmail(e.target.value)
                                                    }
                                                    placeholder="johndoe@example.com"
                                                    required
                                                />

                                                {!isEmailValid(email) ? (
                                                    <p className="mt-2 text-sm text-red-600 ">
                                                        Please enter a valid
                                                        email address.
                                                    </p>
                                                ) : null}
                                            </div>
                                        </fieldset>
                                        <fieldset className="Fieldset">
                                            <div className="mb-2 ms-5 flex flex-col items-start">
                                                {/* Choice between docker and our private registry */}
                                                {/* Replace by using Flowbite Tailwind CSS */}
                                                <label
                                                    htmlFor="role"
                                                    className="mb-2 block text-sm font-medium text-gray-900"
                                                >
                                                    Registry
                                                </label>
                                                <select
                                                    id="image-registries"
                                                    className="bg-gray-40 mb-2 block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500"
                                                    onChange={(e) => {
                                                        setRole(
                                                            e.target
                                                                .value as ContainerNamespaceMembershipRole,
                                                        );
                                                    }}
                                                >
                                                    <option value="MEMBER">
                                                        Member
                                                    </option>
                                                    <option value="ADMIN">
                                                        Admin
                                                    </option>
                                                </select>
                                            </div>
                                        </fieldset>
                                    </div>
                                    {/*footer*/}
                                    <div className="flex items-center justify-end rounded-b border-t border-solid border-slate-200 p-6">
                                        <button
                                            className="Button stuga-red-color mb-1 mr-1 px-6 py-2 text-sm font-bold"
                                            type="button"
                                            onClick={() => {
                                                closeModal();
                                            }}
                                        >
                                            Close
                                        </button>
                                        <button
                                            className="Button stuga-primary-color mb-1 mr-1 px-6 py-3"
                                            type="button"
                                            onClick={(e) => handleSubmit(e)}
                                        >
                                            Add member
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
                </>
            ) : null}
        </>
    );
}
