"use client";
import { DatabasePage } from "@/components/project/database";
import { Breadcrumb, BreadcrumbItem } from "@/components/shared/breadcrumb";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const queryClient = new QueryClient();


export default async function NewDatabasePage() {
  const { project } = useParams();
  const breadcrumbItem: BreadcrumbItem[] = [ 
      {text: "project", slug: `/projects/${project}`},
      {text: "database", slug: `project", slug: "/projects/${project}/services/database/`},
    ];
    return (
        <QueryClientProvider client={queryClient}>
            <div className="z-10 flex w-full flex-col items-center justify-center">
                <div className="mt-10 flex w-4/5 flex-row items-center justify-between">
                    <Breadcrumb items={breadcrumbItem} />
                    <DatabasePage />
                </div>
            </div>
        </QueryClientProvider>
    );
}
