"use client";
import { Session } from "next-auth";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { Project } from "@/lib/models/project";
import { ContainerApplicationNamespace } from "@/lib/models/containers/container-application-namespace";
import { LoadingSpinner } from "@/components/shared/icons";
import { EditableText } from "@/components/services/containers/namespaces/details/editable-text";
import { DisplayToast } from "@/components/shared/toast/display-toast";
import axios from "axios";
import { ContainerNamespace } from "@/lib/models/containers/prisma/container-namespace";
import Image from "next/image";
import { getUserBadge } from "@/lib/services/containers/member-badge-component";
import AddUserToContainerNamespace from "@/components/services/containers/namespaces/details/add-user-to-container-namespace";
import { sortUserByName } from "@/lib/utils";

export default function NamespaceSettings({
    session,
    project,
    namespace,
    namespaceInAPI,
    reloadNamespace,
}: {
    session: Session;
    project: Project;
    namespace: ContainerNamespace;
    namespaceInAPI: ContainerApplicationNamespace;
    reloadNamespace: () => void;
}) {
    if (!session) redirect("/");
    if (!namespace) redirect(`/projects/${project.id}/services/containers`);

    const [loading, setLoading] = useState(false);

    const updateNamespaceDescription = async (description: string) => {
        setLoading(true);
        try {
            const res = await axios.put(
                `/api/projects/${project.id}/services/containers/namespaces/${namespace.id}`,
                {
                    description,
                },
            );
            DisplayToast({
                type: "success",
                message: "Successfully updated namespace description.",
            });
            reloadNamespace();
            setLoading(false);
        } catch (error: any) {
            if (error.response.status === 403) {
                DisplayToast({
                    type: "error",
                    message:
                        "You do not have permission to update this namespace.",
                });
            }
            if (error.response.status === 404) {
                DisplayToast({
                    type: "error",
                    message:
                        "Could not find namespace, please try again later or contact support.",
                });
            }
            console.log(error);
            DisplayToast({
                type: "error",
                message:
                    "Could not update namespace description, please try again later or contact support.",
            });

            setLoading(false);
        }
    };

    const [namespaceMembers, setNamespaceMembers] = useState<any>(null);

    const getNamespaceMembers = async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                `/api/projects/${project.id}/services/containers/namespaces/${namespace.id}/members`,
            );
            return res.data.users;
        } catch (error) {
            console.log(error);
            DisplayToast({
                type: "error",
                message:
                    "Could not get namespace members, please try again later or contact support.",
                duration: 5000,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getNamespaceMembers()
            .then((members) => {
                setNamespaceMembers(members);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const reloadNamespaceMembers = async () => {
        const members = await getNamespaceMembers();
        setNamespaceMembers(members);
    };

    const removeContainerNamespaceMember = async (
        memberId: string,
        namespaceId: string,
    ) => {
        try {
            setLoading(true);
            const response = await axios.delete(
                `/api/projects/${project.id}/services/containers/namespaces/${namespaceId}/members/${memberId}`,
                {
                    method: "DELETE",
                },
            );
            DisplayToast({
                type: "success",
                message: "Successfully removed member from namespace.",
                duration: 5000,
            });
            await reloadNamespaceMembers();
            setLoading(false);
        } catch (error) {
            console.log(`Error removing member from namespace`, error);
            DisplayToast({
                type: "error",
                message:
                    "Could not remove member from namespace, please try again later or contact support.",
                duration: 5000,
            });
            setLoading(false);
        }
    };

    return (
        <div className="z-10 flex w-4/5 flex-col">
            {loading && <LoadingSpinner />}
            <div className="mb-4 flex w-4/5 flex-row items-center justify-between">
                <h2 className="mb-5 w-full text-2xl font-bold">
                    Namespace information
                </h2>
            </div>
            {/*  Display namespace description  */}
            <div className="mb-4 ms-12 flex w-4/5 flex-col gap-4">
                <h3 className="w-2/5 text-xl font-bold">Description</h3>
                <EditableText
                    text={namespaceInAPI.description}
                    onSave={(newValue) => {
                        updateNamespaceDescription(newValue);
                    }}
                />
            </div>

            {/*  See members of the namespace and be able to add new members  */}
            <div className="mt-12 flex w-4/5 flex-row items-center justify-between">
                <h2 className="mb-5 w-full text-2xl font-bold">Members</h2>
            </div>
            <div className="z-10 mb-4 ms-12 flex w-4/5 flex-col gap-4">
                <div className="flex items-center gap-2 py-4">
                    <AddUserToContainerNamespace
                        project={project}
                        namespaceId={namespace.id}
                        afterAddedMember={async () => {
                            await reloadNamespaceMembers();
                        }}
                        user={session.user}
                    />
                </div>
                {!loading && namespaceMembers && (
                    <div className="flex items-center gap-2">
                        <table className="w-full text-left text-sm text-gray-500">
                            <tbody>
                                {namespaceMembers.length > 0 &&
                                    namespaceMembers
                                        .sort(sortUserByName)
                                        .map((member: any) => {
                                            if (member.user) {
                                                return (
                                                    <tr
                                                        className="bg-white"
                                                        key={member.user.id}
                                                    >
                                                        {/* User image */}
                                                        {member.user.image ? (
                                                            <td
                                                                className="px-6 py-4"
                                                                key={
                                                                    member.user
                                                                        .id
                                                                }
                                                            >
                                                                <div className="flex items-center">
                                                                    <div className="h-10 w-10 flex-shrink-0">
                                                                        <Image
                                                                            src={
                                                                                member
                                                                                    .user
                                                                                    .image
                                                                            }
                                                                            alt=""
                                                                            width={
                                                                                40
                                                                            }
                                                                            height={
                                                                                40
                                                                            }
                                                                            className="rounded-full"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        ) : (
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center">
                                                                    <div className="h-10 w-10 flex-shrink-0">
                                                                        <Image
                                                                            src={
                                                                                "/stuga-logo.png"
                                                                            }
                                                                            alt="Stuga logo"
                                                                            width={
                                                                                40
                                                                            }
                                                                            height={
                                                                                40
                                                                            }
                                                                            className="rounded-full"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        )}
                                                        <th
                                                            scope="row"
                                                            className="whitespace-nowrap px-6 py-4 font-medium text-gray-900"
                                                        >
                                                            {member.user.name}
                                                        </th>
                                                        <td className="px-6 py-4">
                                                            {member.user.email}
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            {getUserBadge(
                                                                namespaceMembers,
                                                                member,
                                                                project,
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            {member.user.id ===
                                                            (
                                                                session.user as any
                                                            ).id ? (
                                                                //     Display fun message if member is current user
                                                                <span className="font-bold">
                                                                    You
                                                                </span>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    className="inline-flex items-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                                                    onClick={async () => {
                                                                        await removeContainerNamespaceMember(
                                                                            member
                                                                                .user
                                                                                .id,
                                                                            namespace.id,
                                                                        );
                                                                    }}
                                                                >
                                                                    Remove
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            } else {
                                                // Display user is not found
                                                return (
                                                    <tr
                                                        key={member.id}
                                                        className="bg-white"
                                                    >
                                                        {/* Take all the cols */}
                                                        <td
                                                            className="px-6 py-4"
                                                            colSpan={5}
                                                        >
                                                            User with id{" "}
                                                            {member.id} is not
                                                            found
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
