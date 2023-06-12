"use client";
import { useEffect, useState } from "react";
import ProjectSettingsTabs from "./project-settings-tabs";
import ProjectGlobalSettings from "./project-global-settings";
import ProjectMembersSettings from "./project-membership-settings";
import { useRouter } from "next/navigation";
import { toastEventEmitter } from "@/lib/event-emitter/toast-event-emitter";
import { Project } from "@/lib/models/project";
import LoadingSpinner from "../../shared/icons/loading-spinner";
import { StugaError } from "@/lib/services/error/error";
import axios from "axios";

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
            const res = await axios.get(`/api/projects/${projectId}`);
            return res.data;
        } catch (error: any) {
            console.log(error);
            if (error.response.status === 404) {
                throw new StugaError({
                    message: "Project not found",
                    status: 404,
                    error: "project_not_found",
                    context: error,
                });
            }
            if (error.response.status === 403) {
                throw new StugaError({
                    message: "You are not allowed to access this project",
                    status: 403,
                    error: "project_not_allowed",
                    context: error,
                });
            }
            throw new StugaError({
                message: "Error when try to get project",
                status: 500,
                error: "internal_server_error",
                context: error,
            });
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
                if (error.status === 404 || error.status === 403) {
                    toastEventEmitter.emit("pop", {
                        type: "danger",
                        message: error.message,
                        duration: 2000,
                    });
                    console.error(error);
                    setTimeout(() => {
                        router.push(`/`);
                    }, 2500);
                    return;
                }
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
