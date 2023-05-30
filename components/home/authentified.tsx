"use client"
import { Session } from "next-auth";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import NewProject from "./new-project";
import './dialog.css';

export default function Authentified({ session }: { session: Session | null }) {
    const router = useRouter();
    const { email, image, name } = session?.user || {};
    if (!email) return null;

    return (
        <div className="z-10 w-4/5 justify-start">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="overflow-hidden rounded-full">
                        <Image
                            alt={email}
                            src={
                                image ||
                                `https://avatars.dicebear.com/api/micah/${email}.svg`
                            }
                            width={40}
                            height={40}
                        />
                    </div>
                    <h6 className="my-4 text-4xl font-bold text-gray-700 md:text-4xl">
                        {name}
                    </h6>
                </div>
                {/* <button className="hover:bg-white-500 text-black-700 flex h-12 items-center gap-2 rounded border border-gray-700 bg-transparent px-4  py-2 text-sm font-semibold hover:border-none hover:bg-gray-200 hover:text-white" 
                    onClick={() => router.push('/projects/new')}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 4v16m8-8H4"
                        ></path>
                    </svg>
                    <text>New Project</text>
                </button> */}
                <NewProject session={session} />
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
                        Create a new project
                    </h5>
                    <p className="text-gray-500">
                        Deploy containers, lambdas, secure database and more.
                    </p>
                </div>
            </div>
        </div>
    );
}
