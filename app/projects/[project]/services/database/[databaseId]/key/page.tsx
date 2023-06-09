"use client";
import { Breadcrumb, BreadcrumbItem } from "@/components/shared/breadcrumb";
import { ChangeEvent, useState } from "react";
import { DatabaseProjectParam } from "types/param";

export default function Key({ params }: DatabaseProjectParam) {
    const { project } = params;
    const breadcrumbItem: BreadcrumbItem[] = [
        { text: "project", slug: `/projects/${project}` },
        {
            text: "database",
            slug: `project", slug: "/projects/${project}/services/database/`,
        },
    ];

    const [databaseName, setDatabaseName] = useState("");

    const handleSubmit = () => {};

    return (
        <>
            <Breadcrumb items={breadcrumbItem} />
            <div className="mr-3 h-full w-full border-2 border-red-700 p-5">
                <form onSubmit={handleSubmit}>
                    <div className="pb-1">
                        <label
                            htmlFor="database-name"
                            className="mb-2 block text-sm font-medium text-gray-900"
                        >
                            Database name
                        </label>
                        <input
                            name="name"
                            id="database-name"
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                            value={databaseName}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setDatabaseName(e.target.value)
                            }
                        />
                    </div>
                </form>
            </div>
        </>
    );
}
