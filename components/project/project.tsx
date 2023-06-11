"use client";
import Image from "next/image";
import LoadingSpinner from "@/components/shared/icons/loading-spinner";
import { useEffect, useState } from "react";
import { Session } from "next-auth";
import { Project } from "@/lib/models/project";
import NewService from "./new-service";
import "../shared/css/dialog.css";
import { useRouter } from "next/navigation";
import ProjectSettingsButton from "@/components/project/settings/project-settings-button";
import { toastEventEmitter } from "@/lib/event-emitter/toast-event-emitter";
import ServiceCard from "./service-card";

export interface GetServiceResponse {
    registry: any | null;
    lambda: any | null;
    containers: any | null;
    database: any | null;
}

export default function Project({
    session,
    projectId,
}: {
    session: Session | null;
    projectId: string;
}) {
    // @ts-ignore
    const { email, image, name, id } = session?.user || {};
    const [loader, setLoader] = useState(true);
    const [services, setServices] = useState([]);
    const [servicesSupported, setServicesSupported] = useState(
        {} as GetServiceResponse,
    );
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

    const getServices = async (
        projectId: string,
    ): Promise<GetServiceResponse> => {
        try {
            const res = await fetch(`/api/projects/${projectId}/services`);

            const servicesSupported = await res.json();
            return servicesSupported;
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    useEffect(() => {
        setLoader(true);
        if (!projectId) return;
        getProject(projectId)
            .then((project) => {
                setProject(project);
            })
            .catch((error) => {
                toastEventEmitter.emit("pop", {
                    type: "danger",
                    message: "error when try to get project informations",
                    duration: 2000,
                });
                router.push(`/`);
            });

        getServices(projectId)
            .then((servicesSupported) => {
                setServicesSupported(servicesSupported);
            })
            .catch((error) => {
                toastEventEmitter.emit("pop", {
                    type: "danger",
                    message: "error when try to get services informations",
                    duration: 2000,
                });
                router.push(`/`);
            })
            .finally(() => setLoader(false));
    }, [projectId]);

    if (!email) return null;

    return (
        <div className="z-10 flex w-full flex-col items-center justify-center">
            <div className="mt-10 flex w-4/5 flex-row items-center justify-between">
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
                    <ProjectSettingsButton
                        session={session}
                        projectId={projectId}
                    />
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
                                        `/projects/${project.id}/services/database`,
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
            ) : !servicesSupported ||
              (!servicesSupported.registry &&
                  !servicesSupported.containers &&
                  !servicesSupported.lambda &&
                  !servicesSupported.database) ? (
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
            ) : null}
            <div className="ms-20 flex w-4/5 flex-row items-start justify-start">
                <div className="grid w-full grid-cols-2 gap-4">
                    {servicesSupported && servicesSupported.registry && (
                        <div
                            key={servicesSupported.containers.id}
                            className="w-full"
                        >
                            <ServiceCard
                                key={servicesSupported.registry.id}
                                title="Container registry"
                                description="Your image storage"
                                imageName="docker.png"
                                onClick={() => {
                                    router.push(
                                        `/projects/${project.id}/services/registry`,
                                    );
                                }}
                            />
                        </div>
                    )}
                    {servicesSupported && servicesSupported.containers && (
                        <div key={servicesSupported.containers.id}>
                            <ServiceCard
                                key={servicesSupported.containers.id}
                                title="Containers"
                                description="Your containerized applications"
                                imageName="containers.png"
                                onClick={() => {
                                    router.push(
                                        `/projects/${project.id}/services/containers`,
                                    );
                                }}
                            />
                        </div>
                    )}
                    {servicesSupported && servicesSupported.lambda && (
                        <div key={servicesSupported.lambda.id}>
                            <ServiceCard
                                key={servicesSupported.lambda.id}
                                title="Lambdas"
                                description="your serverless functions"
                                imageName="docker.png"
                                onClick={() => {
                                    router.push(
                                        `/projects/${project.id}/services/lambda`,
                                    );
                                }}
                            />
                        </div>
                    )}
                    {servicesSupported && servicesSupported.database && (
                        <div key={servicesSupported.database.id}>
                            <ServiceCard
                                key={servicesSupported.database.id}
                                title="Lambdas"
                                description="your managed secure database"
                                imageName="docker.png"
                                onClick={() => {
                                    router.push(
                                        `/projects/${project.id}/services/database`,
                                    );
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
