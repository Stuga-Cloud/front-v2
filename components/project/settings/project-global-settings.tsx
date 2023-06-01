import { Project } from "@/lib/models/project";
import { useState } from "react";
import LoadingSpinner from "../../shared/icons/loading-spinner";

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
            console.log("Updated project", updateProject);
            setProject(updateProject);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    return (
        <div className="flex w-4/5 justify-start py-4">
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            )}
            <form onSubmit={updateProject} className="flex flex-col gap-4">
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
                        className="dark:shadow-sm-light block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        placeholder="The Stuga Cloud Project"
                        defaultValue={project.name}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    Save modifications
                </button>
            </form>
        </div>
    );
}
