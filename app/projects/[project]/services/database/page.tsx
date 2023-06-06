import { DatabaseComponent } from "@/components/project/database";
import { Breadcrumb, BreadcrumbItem } from "@/components/shared/breadcrumb";
import type { ProjectParam } from "types/param";

export default function DatabaseList({params}: ProjectParam) {
  const { project } = params;
  const breadcrumbItem: BreadcrumbItem[] = [ 
      {text: "project", slug: `/projects/${project}`},
      {text: "database", slug: `project", slug: "/projects/${project}/services/database/`},
    ];
    return (
      <div className="z-10 flex w-full flex-col items-center justify-center">
          <div className="mt-10 w-4/5">
              <Breadcrumb items={breadcrumbItem} />
              <DatabaseComponent />
          </div>
      </div>
    );
}
