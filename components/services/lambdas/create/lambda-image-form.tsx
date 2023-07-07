import { toastEventEmitter } from "@/lib/event-emitter/toast-event-emitter";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import Link from "next/link";
import { isLambdaImageNameValid } from "@/lib/models/lambdas/validation/lambda-create-candidate";
import { availableRegistries } from "@/lib/models/lambdas/config/lambda-create-config";
import { DisplayToast } from "@/components/shared/toast/display-toast";

export type AvailableRegistriesName = "Docker hub" | "Our private registry";

export interface AvailableRegistriesInformation {
    name: AvailableRegistriesName;
    url: string;
}

const findRegistryByName = (
    name: AvailableRegistriesName,
): AvailableRegistriesInformation => {
    if (availableRegistries.find((registry) => registry.name === name)) {
        return availableRegistries.find((registry) => registry.name === name)!;
    }
    // toastEventEmitter.emit("pop", {
    //     type: "danger",
    //     message: `Registry ${name} not found`,
    //     duration: 5000,
    // });
    DisplayToast({
        type: "error",
        message: `Registry ${name} not found`,
        duration: 4000,
    });
    return availableRegistries[0];
};

export default function LambdaImageForm({
    imageNameValue,
    handleImageNameChange,
    handleRegistryChange,
}: {
    imageNameValue?: string
    handleImageNameChange: (imageName: string) => void;
    handleRegistryChange: (registry: AvailableRegistriesInformation) => void;
}) {
    const [imageName, setImageName] = useState(imageNameValue || "");
    const [registry, setRegistry] = useState<AvailableRegistriesInformation>(
        availableRegistries[0],
    );
    return (
        <div className="mb-10 flex min-h-96 w-full flex-col">
            {/*    Remember that step 2 is concerning the docker image (or other registry) */}
            <div className="mb-2 ms-5 flex flex-col items-start">
                {/* Choice between docker and our private registry */}
                {/* Replace by using Flowbite Tailwind CSS */}
                <label
                    htmlFor="image-registries"
                    className="mb-2 block text-sm font-medium text-gray-900"
                >
                    Select a registry
                </label>
                <select
                    id="image-registries"
                    className="bg-gray-40 mb-2 block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 "
                    onChange={(e) => {
                        handleRegistryChange(
                            findRegistryByName(
                                e.target.value as AvailableRegistriesName,
                            ),
                        );
                        setRegistry(
                            findRegistryByName(
                                e.target.value as AvailableRegistriesName,
                            ),
                        );
                    }}
                >
                    {availableRegistries.map((registry) => {
                        return (
                            <option key={registry.name} value={registry.name}>
                                {registry.name} ({registry.url})
                            </option>
                        );
                    })}
                </select>
            </div>
            <div className="mb-2 ms-5 flex flex-col gap-1">
                <label
                    htmlFor="image-name"
                    className="mb-2 block text-sm font-medium text-gray-900"
                >
                    Image from {registry.name}
                </label>
                <input
                    id="image-name"
                    className={`bg-gray-40 mb-2 block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 ${!isLambdaImageNameValid(
                        imageName,
                    )}`}
                    type="text"
                    value={imageName}
                    onChange={(e) => {
                        handleImageNameChange(e.target.value);
                        setImageName(e.target.value);
                    }}
                    placeholder="organization/my-first-application:latest"
                />
                {/* <h4 className="pt-8 text-2xl font-bold ">
                    The used image is at:
                </h4>
                <p className="text-1xl font-semibold leading-normal text-blue-800 ">
                    <Link
                        href={registry.url + "/r/" + imageName}
                        target="_blank"
                    >
                        {registry.url}/r/
                        {imageName}
                    </Link>
                </p> */}
            </div>
        </div>
    );
}
