import { DatabaseComponent } from "@/components/project/database";
import { Breadcrumb, BreadcrumbItem } from "@/components/shared/breadcrumb";


type ProjectParam = {params: { project: string }};

export default async function DatabasePage({params}: ProjectParam) {
  const { project } = params;
  const breadcrumbItem: BreadcrumbItem[] = [ 
      {text: "project", slug: `/projects/${project}`},
      {text: "database", slug: `project", slug: "/projects/${project}/services/database/`},
    ];
    return (
      <div className="z-10 flex w-full flex-col items-center justify-center">
          <div className="mt-10 flex w-4/5 flex-row items-center justify-between">
              <Breadcrumb items={breadcrumbItem} />
              <DatabaseComponent />
          </div>
      </div>
    );
}
