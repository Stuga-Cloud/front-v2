"use client";
import { Session } from "next-auth";
import { redirect, useRouter } from "next/navigation";
import React, { useState } from "react";
import { Project } from "@/lib/models/project";

export default function ContainersDocumentation({
    session,
    project,
}: {
    session: Session;
    project: Project;
}) {
    if (!session) redirect("/");
    if (!project) redirect(`/projects/${project.id}`);

    const containerDocumentationURL =
        process.env.NEXT_PUBLIC_CONTAINER_DOCUMENTATION_URL;

    return (
        <>
            <div className="z-10 flex w-full flex-col items-center justify-center">
                <div className="flex w-4/5 flex-col items-start justify-start">
                    <h1 className="text-start text-2xl font-bold">
                        Documentation
                    </h1>
                    <div className="mt-5 flex w-full flex-col items-start justify-start">
                        <a
                            href={containerDocumentationURL}
                            target="_blank"
                            className="Button stuga-primary-color flex items-start justify-start"
                            rel="noreferrer"
                        >
                            Go to documentation
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
