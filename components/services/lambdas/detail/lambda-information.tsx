import { isLambdaNameValid } from "@/lib/models/lambdas/validation/lambda-create-candidate";
import { Lambda } from "@prisma/client";
import LambdaSettingsForm from "../create/lambda-settings-form";
import LambdaImageForm, {
    AvailableRegistriesInformation,
} from "../create/lambda-image-form";
import {
    LambdaCPULimit,
    LambdaMemoryLimit,
} from "@/lib/models/lambdas/lambda-create";
import { memoryLimitsChoices } from "@/lib/models/lambdas/config/lambda-create-config";
import { cpuLimitsChoices } from "../../../../lib/models/lambdas/config/lambda-create-config";
import LambdaScalabilityForm from "../create/lambda-scalability-form";
import LambdaNameForm from "../create/lambda-name-form";

export default function LambdaInformation({
    setLambda,
    lambda,
}: {
    setLambda: (lambda: Lambda) => void;
    lambda: Lambda;
}) {
    return (
        <>
            <h2 className="mb-5 ms-10 mt-10 w-4/5 text-3xl font-bold">
                Lambda Details
            </h2>
            <div className="mt-10 w-4/5">
                <h2 className="mb-5 ms-5 mt-10 w-4/5 text-xl font-bold">
                    Name
                </h2>
                <LambdaNameForm
                    name={lambda?.name}
                    isLambdaNameValid={(name) => isLambdaNameValid(name)}
                    handleChangeName={(name: string) => {
                        setLambda({
                            ...lambda,
                            name: name,
                        });
                    }}
                />

                <h2 className="mb-5 ms-5 mt-10 w-4/5 text-xl font-bold">
                    Image Used
                </h2>
                <LambdaImageForm
                    imageNameValue={lambda.imageName}
                    handleImageNameChange={(image: string) => {
                        setLambda({
                            ...lambda,
                            imageName: image,
                        });
                    }}
                    handleRegistryChange={(
                        registry: AvailableRegistriesInformation,
                    ) => {}}
                />

                <h2 className="mb-5 mt-10 w-4/5 text-xl font-bold">Settings</h2>
                <LambdaSettingsForm
                    timeout={lambda.timeoutSeconds}
                    cpuChoices={cpuLimitsChoices}
                    memoryChoices={memoryLimitsChoices}
                    cpuConfig={
                        cpuLimitsChoices.find(
                            (cpu) => cpu.value === lambda.cpuLimitmCPU,
                        )!
                    }
                    memoryConfig={
                        memoryLimitsChoices.find(
                            (memory) => memory.value === lambda.memoryLimitMB,
                        )!
                    }
                    onChange={(
                        cpuConfig: LambdaCPULimit,
                        memoryConfig: LambdaMemoryLimit,
                        timeout: number,
                    ) => {
                        setLambda({
                            ...lambda,
                            cpuLimitmCPU: cpuConfig.value,
                            memoryLimitMB: memoryConfig.value,
                            timeoutSeconds: timeout,
                        });
                    }}
                />

                <h2 className="mb-5 mt-10 w-4/5 text-xl font-bold">
                    Scalability
                </h2>
                <LambdaScalabilityForm
                    maxInstanceNumber={lambda.maxInstances}
                    minInstanceNumber={lambda.minInstances}
                    setMinInstanceNumber={(value: number) => {
                        setLambda({
                            ...lambda,
                            minInstances: value,
                        });
                    }}
                    setMaxInstanceNumber={(value: number) => {
                        setLambda({
                            ...lambda,
                            maxInstances: value,
                        });
                    }}
                    isMaxInstanceNumberValid={(value: number) => {
                        return value <= 10 && value >= lambda.minInstances;
                    }}
                    isMinInstanceNumberValid={(value: number) => {
                        return value >= 0 && value <= lambda.maxInstances;
                    }}
                />
            </div>
            <button type="submit" className="Button stuga-primary-color">
                Update lambda
            </button>
        </>
    );
}
