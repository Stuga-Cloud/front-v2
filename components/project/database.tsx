"use client";
import { ApiService } from "@/lib/api-service";
import { generateRandomName } from "@/lib/utils";
import {
    useQuery,
    useMutation,
} from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";
import { LoadingSpinner } from "../shared/icons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export interface Database {
    name: string;
    projectId: string;
    id: string;
}

const queryClient = new QueryClient();

export function DatabaseComponent() {
    return (
        <QueryClientProvider client={queryClient}>
          <Inner/>
        </QueryClientProvider>
    );
}

function Inner() {
    const { project } = useParams();
    const [fetchTrigger, setFetchTrigger] = useState(1);
    const { status, data, error } = useQuery<Database[]>({
        queryKey: [project, fetchTrigger],
        queryFn: () => ApiService.get<Database[]>(`/api/projects/${project}/services/databases`),
        enabled: !!fetchTrigger
    });

    const createDatabaseMutation = useMutation(
        async () => {
            const randomName = generateRandomName();
            return ApiService.post(
                `/api/projects/${project}/services/databases`,
                { name: randomName },
            );
        },
        {
          onSuccess: () => setFetchTrigger(fetchTrigger + 1),
        },
    );
    const handleCreateDatabase = () => {
        createDatabaseMutation.mutate();
    };
    if (error || createDatabaseMutation.isError) {
        console.error(
            "Error:",
            error ? data : createDatabaseMutation.error,
        );
        return <p>Failed to create database</p>;
    }
  return (
    <>
      <h1 className="mb-2 text-center text-3xl font-extrabold leading-loose leading-relaxed tracking-tight text-gray-900 dark:text-white md:text-4xl lg:text-5xl">
          Deploy {" "} your {" "}
          <mark className="rounded bg-rose-400 px-2 leading-relaxed text-white dark:bg-green-300">
           Zero Knowledge Database
          </mark>
      </h1>
      <button onClick={handleCreateDatabase}>Create Database</button>
      {createDatabaseMutation.isLoading && <p>Creating database...</p>}
      {status === "loading" && <LoadingSpinner />}
      {data && (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
                  {data.map((database: Database) => (
                    <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {database.name}
                        </th>
                        <td className="px-6 py-4">
                            {database.id}
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
