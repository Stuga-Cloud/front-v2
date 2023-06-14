"use client";
import { Session } from "next-auth";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { Project } from "@/lib/models/project";
import { ContainerApplicationNamespace } from "@/lib/models/containers/container-application-namespace";
import { LoadingSpinner } from "@/components/shared/icons";
import { EditableText } from "@/components/services/containers/namespaces/details/editable-text";
import { DisplayToast } from "@/components/shared/toast/display-toast";
import axios from "axios";
import { ContainerNamespace } from "@/lib/models/containers/prisma/container-namespace";

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

    const router = useRouter();
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

    return (
        <>
            <div className="z-10 flex w-full flex-col items-center justify-center">
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
                            console.log("On save new description", newValue);
                            updateNamespaceDescription(newValue);
                        }}
                    />
                </div>

                {/*  See members of the namespace and be able to add new members  */}
            </div>
        </>
    );
}
