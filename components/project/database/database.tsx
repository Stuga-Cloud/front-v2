"use client";
import { ApiService } from "@/lib/api-service";
import { generateRandomName } from "@/lib/utils";
import {
    QueryClient,
    QueryClientProvider,
    useMutation,
    useQuery,
} from "@tanstack/react-query";
import { Suspense, useState } from "react";
import Link from "next/link";
import { LoadingSpinner } from "@/components/shared/icons";
import Nav from "@/components/layout/nav";
import { Session } from "@prisma/client";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import project from "../project";

export interface Database {
    name: string;
    projectId: string;
    id: string;
}

const queryClient = new QueryClient();

export function DatabaseComponent({
    session,
    params,
}: {
    session: Session;
    params: Params;
}) {
    return (
        <QueryClientProvider client={queryClient}>
            <Inner session={session} params={params} />
        </QueryClientProvider>
    );
}

function Inner({ session, params }: { session: Session; params: Params }) {
    const [fetchTrigger, setFetchTrigger] = useState(1);
    const { status, data, error } = useQuery<Database[]>({
        queryKey: [project, fetchTrigger],
        queryFn: () =>
            ApiService.get<Database[]>(
                `/api/projects/${project}/services/databases`,
            ),
        enabled: !!fetchTrigger,
    });

    const createDatabaseMutation = useMutation({
        mutationFn: async () => {
            const randomName = generateRandomName();
            return ApiService.post(
                `/api/projects/${project}/services/databases`,
                { name: randomName },
            );
        },
        onSettled: () => {
            console.log(`fetchtrigger: ${fetchTrigger + 1}`);
            setFetchTrigger(fetchTrigger + 1);
        },
    });
    const handleCreateDatabase = () => {
        createDatabaseMutation.mutate();
    };
    if (error || createDatabaseMutation.isError) {
        console.error("Error:", error ? data : createDatabaseMutation.error);
        return <p>Failed to create database</p>;
    }
    return (
        <>
            <Suspense fallback="...">
                <Nav
                    session={session}
                    breadcrumbItems={[
                        { text: "project", slug: `project/${params.project}` },
                    ]}
                />
            </Suspense>
            <h1 className="mb-2 text-center text-3xl font-extrabold leading-relaxed tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
                Deploy your{" "}
                <mark className="rounded bg-rose-400 px-2 leading-relaxed text-white">
                    Zero Knowledge Database
                </mark>
            </h1>
            <CreateDatabaseButton handleClick={handleCreateDatabase} />
            {createDatabaseMutation.isLoading && <p>Creating database...</p>}
            {status === "loading" && <LoadingSpinner />}
            {data && (
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Database name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    id
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((database, index) => (
                                <tr key={index} className="border-b bg-white">
                                    <th
                                        scope="row"
                                        className="whitespace-nowrap px-6 py-4 font-medium text-gray-900"
                                    >
                                        {database.name}
                                    </th>
                                    <td className="px-6 py-4">
                                        <Link
                                            href={`/projects/${project}/services/database/${database.id}/key`}
                                        >
                                            {database.id}
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}

type CreateDatabaseButtonProps = {
    handleClick: () => void;
};

const CreateDatabaseButton: React.FC<CreateDatabaseButtonProps> = ({
    handleClick,
}) => {
    return (
        <button
            type="button"
            onClick={handleClick}
            className="m-1 mb-2 rounded-lg bg-purple-700 px-3 py-2.5 text-sm font-medium text-white hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300"
        >
            Create Database
        </button>
    );
};
