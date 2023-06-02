"use client";
import { ApiService } from "@/lib/api-service";
import { generateRandomName } from "@/lib/utils";
import {
    useQuery,
    useMutation,
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import { useState } from "react";

interface Database {
    name: string;
    id: string;
}

export function DatabasePage() {
    const projectId = "clie9ta990007atvfiuhvqpwu";
    const [refresh, setRefresh] = useState(0);
    const { data: databases, isError: isFetchError } = useQuery(
        ["databases", projectId, refresh],
        () => ApiService.get(`/api/projects/${projectId}/services/databases`),
        { enabled: !!refresh },
    );
    const createDatabaseMutation = useMutation(
        async () => {
            const randomName = generateRandomName();
            return ApiService.post(
                `/api/projects/${projectId}/services/databases`,
                { name: randomName },
            );
        },
        {
            onSuccess: () => {
                setRefresh(refresh + 1);
            },
        },
    );
    const handleCreateDatabase = () => {
        createDatabaseMutation.mutate();
    };
    if (isFetchError || createDatabaseMutation.isError) {
        console.error(
            "Error:",
            isFetchError ? databases : createDatabaseMutation.error,
        );
        return <p>Failed to create database</p>;
    }
    return (
        <div>
            <button onClick={handleCreateDatabase}>Create Database</button>
            {createDatabaseMutation.isLoading && <p>Creating database...</p>}
            {databases && (
                <ul>
                    {databases.map((database: Database) => (
                        <li key={database.id}>{database.name}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}
