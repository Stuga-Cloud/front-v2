import { toastEventEmitter } from "@/lib/event-emitter/toast-event-emitter";
import {
    AvailableRegistriesInformation,
    AvailableRegistriesName,
} from "../create/lambda-image-form";
import { availableRegistries } from "@/lib/models/lambdas/config/lambda-create-config";
import { useState } from "react";
import Link from "next/link";
import { isLambdaImageNameValid } from "@/lib/models/lambdas/validation/lambda-create-candidate";

const findRegistryByName = (
    name: AvailableRegistriesName,
): AvailableRegistriesInformation => {
    if (availableRegistries.find((registry) => registry.name === name)) {
        return availableRegistries.find((registry) => registry.name === name)!;
    }
    toastEventEmitter.emit("pop", {
        type: "danger",
        message: `Registry ${name} not found`,
        duration: 5000,
    });
    return availableRegistries[0];
};

export default function LambdaImageUpdate({
    imageNameValue,
    registryValue,
    handleImageNameChange,
    handleRegistryChange,
}: {
    imageNameValue?: string;
    registryValue: AvailableRegistriesInformation;
    handleImageNameChange: (imageName: string) => void;
    handleRegistryChange: (registry: AvailableRegistriesInformation) => void;
}) {
    const [imageName, setImageName] = useState(imageNameValue || "");
    const [registry, setRegistry] = useState<AvailableRegistriesInformation>(
        registryValue ?? availableRegistries[0],
    );
    return (
        <div className="mb-10 flex min-h-96 w-4/5 flex-col">
            {/*    Remember that step 2 is concerning the docker image (or other registry) */}
            <div className="mb-2 ms-5 flex flex-col items-start">
                {/* Choice between docker and our private registry */}
                {/* Replace by using Flowbite Tailwind CSS */}
                <label
                    htmlFor="image-registries"
                    className="mb-2 block text-sm font-medium text-gray-900"
                >
                    registry selected
                </label>
                <select
                    id="image-registries"
                    className="bg-gray-40 mb-2 block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 "
                    value={registry.name}
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
                    {availableRegistries.map((registryMap) => {
                        return (
                            <option
                                key={registryMap.name}
                                value={registryMap.name}
                            >
                                {registryMap.name} ({registryMap.url})
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
                <h4 className="pt-8 text-2xl font-bold ">
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
                </p>
            </div>
            <div className="flex justify-center mt-10">
                <button
                    type="submit"
                    className="Button stuga-primary-color mt-10 w-4/5"
                >
                    Deploy lambda
                </button>
            </div>
        </div>
    );
}
