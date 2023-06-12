import { LambdaModel } from "@/lib/models/lambdas/lambda";
import { Lambda } from "@prisma/client";
import { NextResponse } from "next/server";
import { getLambdaImageInProject } from '@/lib/services/lambdas/get-lambda-image-in-user-namespaces';
import { Registry } from "@/lib/models/lambdas/lambda-create";
import { StugaErrorToNextResponse } from "@/lib/services/error/stuga-error-to-next-response";
import { StugaError } from "@/lib/services/error/error";
import ResponseService from "@/lib/next-response";
import { checkIfDockerHubImageExists } from "@/lib/services/utils/check-if-docker-hub-image-exists";
import { getProjectNamespaces } from "@/lib/services/registry/namespace/get-project-namespaces";
import { verifyIfImageExists } from "@/lib/services/lambdas/verify-if-image-exists";

export const checkImageUpdate = async (
    projectId: string,
    lambdaModel: LambdaModel,
    lambdaRegister: Lambda,
) => {
    if (lambdaModel.registry !== lambdaRegister.registry) {
        console.log("registry change redeploy")
        const response = await verifyIfImageExists(
            lambdaModel.imageName,
            projectId,
            lambdaModel.registry,
        );
        if (response instanceof NextResponse) {
            return response;
        }
    }

    if (lambdaModel.imageName !== lambdaRegister.imageName && lambdaModel.registry === lambdaRegister.registry) {
        console.log("image change but not registry")
        console.log({
            name: lambdaModel.imageName,
            projectId,
            registry: lambdaModel.registry,
       
        })
        const response = await verifyIfImageExists(
            lambdaModel.imageName,
            projectId,
            lambdaModel.registry,
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

    
}