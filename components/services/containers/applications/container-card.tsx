import { ContainerApplication } from "@/lib/models/containers/container-application";

export default function ContainerCard({
    projectId,
    application,
}: {
    projectId: string;
    application: ContainerApplication;
}) {
    return (
        <a
            href={`/projects/${projectId}/services/containers/${application.id}`}
        >
            <div className=" mt-8 flex w-full flex-col items-center justify-center rounded-lg bg-white p-6 shadow ">
                {/*<Image*/}
                {/*    src={`/${imageName}`}*/}
                {/*    alt="docker picture"*/}
                {/*    width="60"*/}
                {/*    height="60"*/}
                {/*    className="ms-5"*/}
                {/*></Image>*/}
                <a href="#">
                    <h5 className="pb-5 text-2xl font-semibold tracking-tight text-gray-600">
                        {application.name}
                    </h5>
                </a>
                <p className="pb-6 font-normal text-gray-500">
                    {application.description}
                </p>
                <strong className="pb-6 font-normal text-gray-500">
                    {application.applicationType}
                </strong>

                <a
                    href={`/projects/${projectId}/services/containers/${application.id}`}
                    className="ms-5 inline-flex items-center text-blue-600 hover:underline"
                >
                    See more
                    <svg
                        className="ml-2 h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
                    </svg>
                </a>
            </div>
        </a>
    );
}
