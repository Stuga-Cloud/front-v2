"use client";
import { DatabasePage } from "@/components/project/database";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default async function NewDatabaasePage() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="z-10 flex w-full flex-col items-center justify-center">
                <div className="mt-10 flex w-4/5 flex-row items-center justify-between">
                    <DatabasePage />
                </div>
            </div>
        </QueryClientProvider>
    );
}
