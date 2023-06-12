import {
    cpuLimitsChoices,
    memoryLimitsChoices,
} from "../config/lambda-create-config";
import { LambdaCreateCandidate, Registry } from "../lambda-create";

export const isLambdaNameValid = (lambdaName: string): boolean => {
    var regex = /^[a-zA-Z0-9-]*$/;

    return lambdaName.length > 4 && regex.test(lambdaName);
};

export const isLambdaImageNameValid = (imageName: string): boolean => {
    var regex = /^[a-zA-Z0-9-:]*$/;

    return imageName.length > 4 && regex.test(imageName);
};

export const isRegistryIsValid = (registry: Registry): boolean => {
    return registry === "dockerhub" || registry === "pcr";
};

export const throwIfLambdaCreationCandidateIsNotValid = (
    lambdaCreateCandidate: LambdaCreateCandidate,
): void => {
    const errorMessages = [];
    if (!isLambdaNameValid(lambdaCreateCandidate.name)) {
        errorMessages.push("Lambda name is not valid");
    }

    if (!isLambdaImageNameValid(lambdaCreateCandidate.imageName)) {
        errorMessages.push("Lambda image name is not valid");
    }

    if (lambdaCreateCandidate.imageName.split(":").length !== 2) {
        errorMessages.push("Lambda image name has to have a tag, example: nginx:latest");
    }

    if (
        cpuLimitsChoices.find(
            (config) => config.value === lambdaCreateCandidate.cpuLimit.value,
        ) === undefined
    ) {
        errorMessages.push("CPU limit is not valid");
    }

    if (
        memoryLimitsChoices.find(
            (config) =>
                config.value === lambdaCreateCandidate.memoryLimit.value,
        ) === undefined
    ) {
        errorMessages.push("memory limit is not valid");
    }

    if (!isRegistryIsValid(lambdaCreateCandidate.registry)) {
        errorMessages.push("registry is not valid");
    }

    if (
        lambdaCreateCandidate.minInstanceNumber < 0 ||
        lambdaCreateCandidate.minInstanceNumber >
            lambdaCreateCandidate.maxInstanceNumber
    ) {
        errorMessages.push("min instance number is not valid");
    }

    if (
        lambdaCreateCandidate.maxInstanceNumber > 10 ||
        lambdaCreateCandidate.maxInstanceNumber <
            lambdaCreateCandidate.minInstanceNumber
    ) {
        errorMessages.push("max instance number is not valid");
    }

    if (
        lambdaCreateCandidate.timeout < 0 ||
        lambdaCreateCandidate.timeout > 600
    ) {
        errorMessages.push("timeout is not valid");
    }

    if (lambdaCreateCandidate.confidentiality.visibility === "private") {
        if (lambdaCreateCandidate.confidentiality.access === undefined) {
            errorMessages.push(
                "you need to have a valid private key in order to create a private lambda",
            );
        } else if (
            lambdaCreateCandidate.confidentiality.access.mode === "apiKey"
        ) {
            if (
                lambdaCreateCandidate.confidentiality.access.apiKey ===
                undefined
            ) {
                errorMessages.push(
                    "you need to have a valid private key in order to create a private lambda",
                );
            }
        }
    }

    if (lambdaCreateCandidate.environmentVariables.length > 0) {
        lambdaCreateCandidate.environmentVariables.forEach((env) => {
            if (env.key === "" || env.value === "") {
                errorMessages.push("environment variables can't be empty");
            }
        });
    }

    if (errorMessages.length > 0) {
        throw new Error(errorMessages.join("\n"));
    }
};
