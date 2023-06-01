"use client";
import Image from "next/image";
import LoadingSpinner from "@/components/shared/icons/loading-spinner";
import { use, useState, useEffect } from "react";
import { Session } from "next-auth";
import { Project } from "@/lib/models/project";
import NewService from "./new-service";
import "../shared/css/dialog.css";
import { useRouter } from "next/navigation";
import ProjectSettingsButton from "@/components/project/project-settings-button";

export default function Project({
    session,
    projectId,
}: {
    session: Session | null;
    projectId: string;
}) {
    // @ts-ignore
    const { email, image, name, id } = session?.user || {};
    const [loader, setLoader] = useState(false);
    const [services, setServices] = useState([]);
    const [project, setProject] = useState({} as Project);
    const router = useRouter();

    const getProject = async (projectId: string) => {
        try {
            const res = await fetch(`/api/projects/${projectId}`);
            const project = await res.json();
            return project;
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (!projectId) return;
        getProject(projectId)
            .then((project) => {
                setProject(project.project);
            })
            .catch((error) => {
                router.push(`/`);
            });
    }, [projectId]);

    if (!email) return null;

    return (
        <div className="z-10 flex w-full flex-col items-center justify-center">
            <div className="flex w-4/5 flex-row justify-between items-center mt-10">
                <div className="z-10 w-4/5 justify-start">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="overflow-hidden rounded-full">
                                <Image
                                    alt={email}
                                    src={
                                        image ||
                                        `https://avatars.dicebear.com/api/micah/${email}.svg`
                                    }
                                    width={40}
                                    height={40}
                                />
                            </div>
                            <h6 className="my-4 text-4xl font-bold text-gray-700 md:text-4xl">
                                {name}
                            </h6>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-1 py-4">
                    <ProjectSettingsButton session={session} projectId={id} />
                    <NewService
                        session={session}
                        afterCreate={(
                            service:
                                | "registry"
                                | "lambda"
                                | "container"
                                | "database",
                        ) => {
                            switch (service) {
                                case "registry":
                                    console.log(
                                        `/projects/${project.id}/registries/new`,
                                    );
                                    router.push(
                                        `/projects/${project.id}/services/registry/new`,
                                    );
                                    break;
                                case "lambda":
                                    router.push(
                                        `/projects/${project.id}/services/lambdas/new`,
                                    );
                                    break;
                                case "container":
                                    router.push(
                                        `/projects/${project.id}/services/containers/new`,
                                    );
                                    break;
                                case "database":
                                    router.push(
                                        `/projects/${project.id}/services/databases/new`,
                                    );
                                    break;
                            }
                        }}
                    />
                </div>
            </div>
            {loader ? (
                <div className="flex h-[50vh] items-center justify-center">
                    <LoadingSpinner />
                </div>
            ) : services && services.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                    {services.map((service) => (
                        <div key={service.name}>{service.name}</div>
                    ))}
                </div>
            ) : (
                <div className="flex h-[70vh] w-4/5 items-center justify-center gap-2 border-2  border-dashed">
                    <Image
                        src="/stuga-logo.png"
                        alt="Description de l'image"
                        width="60"
                        height="60"
                    ></Image>
                    <div className="flex h-16 flex-col justify-center overflow-hidden text-sm">
                        <h5 className="text-2xl font-bold text-gray-500 md:text-2xl">
                            Create a new service
                        </h5>
                        <p className="text-gray-500">
                            Deploy containers, lambdas, secure database and
                            more.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
