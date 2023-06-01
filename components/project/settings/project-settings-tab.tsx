"use client";
import { useEffect, useState } from "react";
import ProjectSettingsTabs from "./project-settings-tabs";
import ProjectGlobalSettings from "./project-global-settings";
import ProjectMembersSettings from "./project-membership-settings";
import { useRouter } from "next/navigation";
import { toastEventEmitter } from "@/lib/event-emitter/toast-event-emitter";
import { Project } from "@/lib/models/project";
import LoadingSpinner from "../../shared/icons/loading-spinner";

export type ProjectSettingsPages = "global" | "members";

export default function ProjectSettingsTab({
    projectId,
}: {
    projectId: string;
}) {
    const [activeTab, setActiveTab] = useState<ProjectSettingsPages>("global");
    const [loader, setLoader] = useState(true);
    const [project, setProject] = useState({} as Project);
    const router = useRouter();

    const getProject = async (projectId: string) => {
        try {
            const res = await fetch(`/api/projects/${projectId}`);
            return await res.json();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (!projectId) return;
        getProject(projectId)
            .then((project) => {
                setProject(project);
                setLoader(false);
            })
            .catch((error) => {
                toastEventEmitter.emit("pop", {
                    type: "danger",
                    message: "error when try to get project settings",
                    duration: 2000,
                });
                console.error("error when try to get project settings", error);
                router.push(`/`);
            });
    }, [projectId]);

    return (
        <>
            <div className="z-10 flex w-full flex-col items-center justify-center">
                <h2 className="mb-5 w-4/5 text-4xl font-bold">Settings</h2>
                <ProjectSettingsTabs
                    onClick={(tab: ProjectSettingsPages) => {
                        setActiveTab(tab);
                    }}
                />
                {loader ? (
                    <div className="fixed inset-0 flex items-center justify-center">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <>
                        {activeTab === "global" && (
                            <ProjectGlobalSettings currentProject={project} />
                        )}
                        {activeTab === "members" && (
                            <ProjectMembersSettings project={project} />
                        )}
                    </>
                )}
            </div>
        </>
    );
}
