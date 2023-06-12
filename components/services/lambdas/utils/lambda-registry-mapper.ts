import { Registry } from "@/lib/models/lambdas/lambda-create";
import { AvailableRegistriesInformation } from "../create/lambda-image-form";
import { availableRegistries } from "@/lib/models/lambdas/config/lambda-create-config";

export const AvailableRegistriesToRegistry = (availableRegistry: AvailableRegistriesInformation): Registry => {
    if (availableRegistry.name === "Docker hub") {
        return "dockerhub";
    } else {
        return "pcr";
    }
};


export const LambdaRegistryToAvailableRegistriesInformation = (
    registry: Registry,
): AvailableRegistriesInformation => {
    switch (registry) {
        case "dockerhub":
            return availableRegistries[0];
        case "pcr":
            return availableRegistries[1];
        default:
            return availableRegistries[0];
    }
};