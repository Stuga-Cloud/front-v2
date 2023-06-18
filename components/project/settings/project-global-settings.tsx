import { Project } from "@/lib/models/project";
import { useState } from "react";
import LoadingSpinner from "../../shared/icons/loading-spinner";
import { toastEventEmitter } from "@/lib/event-emitter/toast-event-emitter";

export default function ProjectGlobalSettings({
    currentProject,
}: {
    currentProject: Project;
}) {
    const [loading, setLoading] = useState(false);
    const [project, setProject] = useState(currentProject);

    const updateProject = async (event: any) => {
        event.preventDefault();
        const name = event.target.name.value;
        if (project.name === name) {
            toastEventEmitter.emit("pop", {
                type: "warning",
                message: "Project didn't change",
                duration: 5000,
            });
            return;
        }
        try {
            setLoading(true);
            const response = await fetch(`/api/projects/${project.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                }),
            });
            const updateProject = await response.json();
            setProject(updateProject);
            setLoading(false);
            toastEventEmitter.emit("pop", {
                type: "success",
                message: "Project updated",
                duration: 5000,
            });
        } catch (error) {
            setLoading(false);
            toastEventEmitter.emit("pop", {
                type: "danger",
                message: "Error when try to update project",
                duration: 5000,
            });
        }
    };

    return (
        <div className="flex w-4/5 justify-start py-4">
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            )}
            <form
                onSubmit={updateProject}
                className="flex w-4/5 flex-col gap-4"
            >
                <div className="mb-6">
                    <label
                        htmlFor="name"
                        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Name
                    </label>
                    <input
                        type="name"
                        id="name"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-green-500 dark:focus:ring-green-500"
                        placeholder="The Stuga Cloud Project"
                        defaultValue={project.name}
                        required
                    />
                </div>
                <div className="flex-grow">
                    <button
                        type="submit"
                        className="Button stuga-primary-color"
                    >
                        Save modifications
                    </button>
                </div>
            </form>
        </div>
    );
}
