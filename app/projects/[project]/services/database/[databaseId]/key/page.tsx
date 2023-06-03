"use client";
import { Breadcrumb, BreadcrumbItem } from "@/components/shared/breadcrumb";
import { ChangeEvent, useState } from "react";
import { DatabaseProjectParam } from "types/param";

export default function Key({params}: DatabaseProjectParam) {
  const { project } = params;
  const breadcrumbItem: BreadcrumbItem[] = [ 
    {text: "project", slug: `/projects/${project}`},
    {text: "database", slug: `project", slug: "/projects/${project}/services/database/`},
  ];

  const [databaseName, setDatabaseName] = useState("");

  const handleSubmit = () => {

  };

  return (
    <>
      <Breadcrumb items={breadcrumbItem} />
      <div className="w-full h-full border-red-700 border-2 p-5 mr-3">
        <form onSubmit={handleSubmit}>
          <div className="pb-1">
            <label htmlFor="database-name" className="block mb-2 text-sm font-medium text-gray-900">Database name</label>
            <input name="name" id="database-name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" value={databaseName} onChange={(e: ChangeEvent<HTMLInputElement>) => setDatabaseName(e.target.value)} />
          </div>
        </form>
      </div>
    </>
  )
}
