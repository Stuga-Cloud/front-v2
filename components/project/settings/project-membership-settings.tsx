import { useState } from "react";
import { Session } from "next-auth";
import { Project } from "@/lib/models/project";

export default function ProjectMembersSettings({
    session,
    project,
}: {
    session: Session | null;
    project: Project;
}) {
    const { email, image, name, id } = session?.user || {};
    const [loader, setLoader] = useState(false);
    const members = project.members;

    console.log("Project in project members settings: ", project);

    return (
        <div className="flex w-4/5 flex-col justify-start">
            {/* Add a button on top of the bottom members table to add a new member padding */}
            <div className="flex items-center gap-2 py-4">
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
                    New member
                </button>
            </div>
            <div className="flex items-center gap-2">
                <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                    <tbody>
                        {members.length > 0 &&
                            members.map((member) => {
                                return (
                                    <>
                                        <tr className="bg-white dark:bg-gray-800">
                                            {/* User image */}
                                            {member.image ? (
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 flex-shrink-0">
                                                            <img
                                                                className="h-10 w-10 rounded-full"
                                                                src={
                                                                    member.image
                                                                }
                                                                alt=""
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                            ) : (
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 flex-shrink-0">
                                                            <img
                                                                className="h-10 w-10 rounded-full"
                                                                src={
                                                                    "/stuga-logo.png"
                                                                }
                                                                alt=""
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                            )}
                                            <th
                                                scope="row"
                                                className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                                            >
                                                {member.name}
                                            </th>
                                            <td className="px-6 py-4">
                                                {member.email}
                                            </td>
                                            <td className="px-6 py-4">
                                                Collaborator
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    type="button"
                                                    // make it a little button
                                                    className="inline-flex items-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    </>
                                );
                            })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
