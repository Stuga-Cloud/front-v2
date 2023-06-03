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
      <button onClick={handleCreateDatabase}>Create Database</button>
      {createDatabaseMutation.isLoading && <p>Creating database...</p>}
      {status != "loading" && <LoadingSpinner />}
      {data && (
          <ul>
              {data.map((database: Database) => (
                  <li key={database.id}>{database.name}</li>
              ))}
          </ul>
      )}
    </>
  );
}
