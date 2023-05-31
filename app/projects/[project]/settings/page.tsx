import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Image from "next/image";

export default async function Settings({
    searchParams,
}: {
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const session = await getServerSession(authOptions);
    const { email, image, name } = session?.user || {};

    const projectId = searchParams?.project;
    const project = await fetch(`/api/projects/${projectId}`)
        .then((response) => response.json())
        .catch(() => console.log("error"));
    console.log(project);

    return (
        <>
            <div className="z-10 w-4/5 justify-start">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h6 className="my-4 text-4xl font-bold text-gray-700 md:text-4xl">
                            Settings
                        </h6>
                    </div>
                </div>
                <div className="flex h-[50vh] w-full items-center justify-center gap-2 border-2  border-dashed">
                    <Image
                        src="/stuga-logo.png"
                        alt="Description de l'image"
                        width="60"
                        height="60"
                    ></Image>
                    <div className="flex h-16 flex-col justify-center overflow-hidden text-sm">
                        <h5 className="text-2xl font-bold text-gray-500 md:text-2xl">
                            Create a new service
                        </h5>
                        <p className="text-gray-500">
                            Deploy containers, lambdas, secure database and
                            more.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
