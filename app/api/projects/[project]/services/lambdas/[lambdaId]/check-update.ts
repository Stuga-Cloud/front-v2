import { LambdaModel } from "@/lib/models/lambdas/lambda";
import { Lambda, Project } from "@prisma/client";
import { NextResponse } from "next/server";
import { verifyIfImageExists } from "@/lib/services/lambdas/verify-if-image-exists";
import { GetAPiKey } from "@/lib/services/lambdas/liserk-api/get-api-key";
import { LambdaVisibility } from "@/lib/models/lambdas/lambda-create";

export const checkImageUpdate = async (
    projectId: string,
    lambdaModel: LambdaModel,
    lambdaRegister: Lambda,
) => {
    if (lambdaModel.registry !== lambdaRegister.registry) {
        console.log("registry change redeploy");
        const repository = lambdaModel.imageName.split("/")[0];
        const parts = lambdaModel.imageName.split("/");
        const imageName = parts.slice(1).join("/");
        const response = await verifyIfImageExists(
            imageName,
            projectId,
            lambdaModel.registry,
            repository
        );
        if (response instanceof NextResponse) {
            return response;
        }
    }

    if (
        lambdaModel.imageName !== lambdaRegister.imageName &&
        lambdaModel.registry === lambdaRegister.registry
    ) {
        console.log("image change but not registry");
        console.log({
            name: lambdaModel.imageName,
            projectId,
            registry: lambdaModel.registry,
        });
        const repository = lambdaModel.imageName.split("/")[0];
        const parts = lambdaModel.imageName.split("/");
        const imageName = parts.slice(1).join("/");
        const response = await verifyIfImageExists(
            imageName,
            projectId,
            lambdaModel.registry,
            repository
        );
        if (response instanceof NextResponse) {
            return response;
        }
    }
};

export const checkSettingsUpdate = async (
    lambdaModel: LambdaModel,
    lambdaRegister: Lambda,
) => {
    if (lambdaModel.minInstanceNumber !== lambdaRegister.minInstances) {
        // emit un event pour mettre à jour le min instance
    }

    if (lambdaModel.maxInstanceNumber !== lambdaRegister.maxInstances) {
        // emit un event pour mettre à jour le max instance
    }

    if (lambdaModel.timeout !== lambdaRegister.timeoutSeconds) {
        // emit un event pour mettre à jour le timeout
    }
};

export const checkVisibility = async (
    lambdaModel: LambdaModel,
    lambdaRegister: Lambda,
) => {
    if (lambdaModel.confidentiality.visibility !== lambdaRegister.visibility) {
        // emit un event pour mettre à jour la visibilité
        if (lambdaModel.confidentiality.visibility === "private") {
            // emit un event pour mettre à jour le private config
        }

        if (lambdaModel.confidentiality.visibility === "public") {
            // delete dans la gateway la visibility qui est public
        }
    }
};

export const hasToDeletForRecreate = (
    newLambda: LambdaModel,
    oldLambda: Lambda,
): boolean => {
    return (
        newLambda.imageName !== oldLambda.imageName ||
        newLambda.cpuLimit.value !== oldLambda.cpuLimitmCPU ||
        newLambda.memoryLimit.value !== oldLambda.memoryLimitMB
    );
};

export const hasGatewayToUpdate = (
    newLambda: LambdaModel,
    oldLambda: Lambda,
): boolean => {
    console.log("---------------------")
    console.log(newLambda)
    console.log(oldLambda)
    console.log("---------------------")
    return (
        newLambda.confidentiality.visibility !== oldLambda.visibility ||
        newLambda.name !== oldLambda.name
    );
};

export const hasToGenerateApiKey = async (
    visibility: "private" | "public",
    project: Project,
): Promise<boolean> => {
    try {
        await GetAPiKey({ projectName: project.name });
        return false;
    } catch (e) {
        console.log("error in api key generate");
        // console.log(confidentiality.visibility);
        return visibility === "private";
    }
};

export const hasMetadataToUpdate = (
    newLambda: LambdaModel,
    oldLambda: Lambda,
): boolean => {
    const envVarsAreDifferent = !areArraysEqual(
        newLambda.environmentVariables,
        oldLambda.envVars as KeyValueArray,
    );
    return (
        newLambda.timeout !== oldLambda.timeoutSeconds ||
        envVarsAreDifferent ||
        newLambda.minInstanceNumber !== oldLambda.minInstances ||
        newLambda.maxInstanceNumber !== oldLambda.maxInstances ||
        newLambda.imageName !== oldLambda.imageName ||
        newLambda.cpuLimit.value !== oldLambda.cpuLimitmCPU ||
        newLambda.memoryLimit.value !== oldLambda.memoryLimitMB
    );
};

type KeyValueArray = { key: string; value: string }[];

const areArraysEqual = (a: KeyValueArray, b: KeyValueArray): boolean => {
    // Si les deux tableaux ne sont pas de la même longueur, ils ne peuvent pas être égaux
    if (a.length !== b.length) return false;

    // Trie les tableaux par les clés
    const sortedA = a.sort((x, y) => x.key.localeCompare(y.key));
    const sortedB = b.sort((x, y) => x.key.localeCompare(y.key));

    // Vérifie que chaque objet dans les tableaux triés est le même
    for (let i = 0; i < sortedA.length; i++) {
        if (
            sortedA[i].key !== sortedB[i].key ||
            sortedA[i].value !== sortedB[i].value
        )
            return false;
    }

    // Si nous arrivons à ce point, les tableaux doivent être égaux
    return true;
};
