import { Namespace } from "@/lib/models/registry/namespace";
import { NamespaceWithImageInformationsResponse } from "./namespace-detail";
import { CodeBlock, nord } from "react-code-blocks";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useState } from "react";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { capitalize } from "../../../../lib/utils";
import { yellow } from "@radix-ui/colors";
import { Session } from "next-auth";
import DockerLoginCode from "./docker-login-code";

export default function Settings({
    session,
    namespace,
}: {
    session: Session;
    namespace: NamespaceWithImageInformationsResponse;
}) {
    const [copied, setCopied] = useState(false);
    const code =
        "docker login " +
        " -u " +
        session.user?.email +
        " " +
        process.env.NEXT_PUBLIC_BASE_REGISTRY_ENDPOINT +
        "/" +
        namespace.namespace.name;

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Dismiss after 2 seconds
    };
    return (
        <div className="flex w-4/5 flex-col justify-start">
            <h2 className="mb-5 mt-10 w-4/5 text-3xl font-bold">
                Namespace Informations
            </h2>
            <div className="m-4 grid grid-cols-2 gap-4">
                <div className="rounded bg-blue-200 p-4 shadow-lg">
                    <h2 className="mb-2 text-2xl font-bold">Name</h2>
                    <p className="text-lg text-blue-900">
                        {process.env.NEXT_PUBLIC_BASE_REGISTRY_ENDPOINT +
                            "/" +
                            namespace.namespace.name}
                    </p>
                </div>
                <div className="rounded bg-red-200 p-4 shadow-lg">
                    <h2 className="mb-2 text-2xl font-bold">Size</h2>
                    <p className="text-lg text-red-900">
                        {Math.round(
                            namespace.images.reduce((previous, current) => {
                                return previous + current.size;
                            }, 0) / 1_000_000,
                        )}{" "}
                        MB
                    </p>
                </div>
                <div className="rounded bg-green-200 p-4 shadow-lg">
                    <h2 className="mb-2 text-2xl font-bold">
                        last modification:
                    </h2>
                    <p className="text-lg text-green-900">
                        {namespace.namespace.modifiedAt}
                    </p>
                </div>
                <div className="rounded bg-purple-200 p-4 shadow-lg">
                    <h2 className="mb-2 text-2xl font-bold">accessibility</h2>
                    <p className="text-lg text-purple-900">
                        {namespace.namespace.state}
                    </p>
                </div>
            </div>
            {namespace.namespace.state === "public" ? (
                <>
                    <h2 className="mb-5 mt-10 w-4/5 text-3xl font-bold">
                        You can pull your images with the following command:
                    </h2>
                    <div style={{ position: "relative" }}>
                        <DockerLoginCode
                            code={
                                "docker pull " +
                                process.env.NEXT_PUBLIC_BASE_REGISTRY_ENDPOINT +
                                "/image-example:latest"
                            }
                        />

                        {copied && (
                            <div className="absolute right-2 top-10 z-10 rounded bg-gray-500 px-2 py-1 text-sm text-white">
                                Copied!
                            </div>
                        )}
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        <InfoCircledIcon />
                        <p className="text-sm text-gray-500">
                            You dont need to log in as the namespace is public,
                            you can just pull your image
                        </p>
                    </div>
                </>
            ) : (
                <>
                    <h2 className="mb-5 mt-10 w-4/5 text-3xl font-bold">
                        Connect your docker client to the namespace (if you have
                        the access setup)
                    </h2>
                    <DockerLoginCode code={code} />
                </>
            )}
        </div>
    );
}
