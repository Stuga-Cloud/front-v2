"use client";
import { Session } from "next-auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import NewProject from "./new-project";
import "../shared/css/dialog.css";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "../shared/icons";
import ProjectCard from "./project-card";
import { pathEventEmitter } from "@/lib/event-emitter/path-event-emitter";
import { Project } from "@/lib/models/project";

export default function Authentified({ session }: { session: Session | null }) {
    // @ts-ignore
    const { email, image, name, id } = session?.user || {};
    const [projects, setProjects] = useState([] as Project[]);
    const [loader, setLoader] = useState(true);
    const router = useRouter();

    const refreshProjects = async () => {
        setLoader(true);
        try {
            const response = await fetch(`/api/projects/users/${id}`);
            const data = await response.json();
            setProjects(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoader(false);
        }
    };

    useEffect(() => {
        if (!id) return;

        fetch(`/api/projects/users/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setProjects(data);
            })
            .catch((error) => {
                console.error("Error:", error);
            })
            .finally(() => setLoader(false));
    }, [id]);

    if (!email) return null;

    return (
        <div className="z-10 flex w-full flex-col items-center justify-center">
            <div className=" w-4/5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h6 className="my-4 text-4xl font-bold text-gray-700 md:text-4xl">
                            {name}&apos;s projects
                        </h6>
                    </div>
                    <NewProject
                        afterCreate={refreshProjects}
                        session={session}
                    />
                </div>
                {loader ? (
                    <div className="flex h-[50vh] items-center justify-center">
                        <LoadingSpinner />
                    </div>
                ) : projects && projects.length > 0 ? (
                    <div className="grid grid-cols-3 gap-4">
                        {projects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                name={project.name}
                                onClick={() => {
                                    pathEventEmitter.emit("update", {
                                        path: project.name,
                                    });
                                    router.push(`/projects/${project.id}`);
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex h-[50vh] w-full items-center justify-center gap-2 border-2  border-dashed">
                        <Image
                            src="/stuga-logo.png"
                            alt="Description de l'image"
                            width="60"
                            height="60"
                        ></Image>
                        <div className="flex h-16 flex-col justify-center overflow-hidden text-sm">
                            <h5 className="text-2xl font-bold text-gray-500 md:text-2xl">
                                Create a new project
                            </h5>
                            <p className="text-gray-500">
                                Deploy containers, lambdas, secure database and
                                more.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
