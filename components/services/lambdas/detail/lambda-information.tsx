import { isLambdaNameValid } from "@/lib/models/lambdas/validation/lambda-create-candidate";
import { Lambda } from "@prisma/client";
import LambdaSettingsForm from "../create/lambda-settings-form";
import {
    LambdaCPULimit,
    LambdaMemoryLimit,
} from "@/lib/models/lambdas/lambda-create";
import { memoryLimitsChoices } from "@/lib/models/lambdas/config/lambda-create-config";
import { cpuLimitsChoices } from "../../../../lib/models/lambdas/config/lambda-create-config";
import LambdaScalabilityForm from "../create/lambda-scalability-form";
import LambdaNameForm from "../create/lambda-name-form";
import { LambdaModel } from "../../../../lib/models/lambdas/lambda";

export default function LambdaInformation({
    onUpdate,
    setLambda,
    lambda,
}: {
    onUpdate: () => void;
    setLambda: (lambdaModel: LambdaModel) => void;
    lambda: LambdaModel;
}) {
    return (
        <>
            <h2 className="mb-5 ms-10 mt-10 w-4/5 text-3xl font-bold">
                Lambda Details
            </h2>
            <div className="mt-10 w-4/5">
                <div className="w-full rounded-lg border border-2 border-dashed border-green-300 p-5">
                    <h2 className="mb-5 ms-5 mt-10 w-4/5 text-xl font-bold">
                        Name
                    </h2>
                    {lambda && (
                        <LambdaNameForm
                            name={lambda?.name}
                            isLambdaNameValid={(name) =>
                                isLambdaNameValid(name)
                            }
                            handleChangeName={(name: string) => {
                                setLambda({
                                    ...lambda,
                                    name: name,
                                });
                            }}
                            urlAccess={lambda.urlAccess}
                        />
                    )}
                </div>

                <div className="mt-10 w-full rounded-lg border border-2 border-dashed border-green-300 p-5">
                    <h2 className="mb-5 w-4/5 text-xl font-bold">Settings</h2>
                    <LambdaSettingsForm
                        timeout={lambda.timeout}
                        cpuChoices={cpuLimitsChoices}
                        memoryChoices={memoryLimitsChoices}
                        cpuConfig={lambda.cpuLimit}
                        memoryConfig={lambda.memoryLimit}
                        onChange={(
                            cpuConfig: LambdaCPULimit,
                            memoryConfig: LambdaMemoryLimit,
                            timeout: number,
                        ) => {
                            setLambda({
                                ...lambda,
                                cpuLimit: cpuConfig,
                                memoryLimit: memoryConfig,
                                timeout,
                            });
                        }}
                    />
                </div>
                <div className="mt-10 w-full rounded-lg border border-2 border-dashed border-green-300 p-5">
                    <h2 className="mb-5 w-4/5 text-xl font-bold">
                        Scalability
                    </h2>
                    <LambdaScalabilityForm
                        maxInstanceNumber={lambda.maxInstanceNumber}
                        minInstanceNumber={lambda.minInstanceNumber}
                        setMinInstanceNumber={(value: number) => {
                            setLambda({
                                ...lambda,
                                minInstanceNumber: value,
                            });
                        }}
                        setMaxInstanceNumber={(value: number) => {
                            setLambda({
                                ...lambda,
                                maxInstanceNumber: value,
                            });
                        }}
                        isMaxInstanceNumberValid={(value: number) => {
                            return (
                                value <= 10 && value >= lambda.minInstanceNumber
                            );
                        }}
                        isMinInstanceNumberValid={(value: number) => {
                            return (
                                value >= 0 && value <= lambda.maxInstanceNumber
                            );
                        }}
                    />
                </div>
            </div>
            <button
                type="submit"
                className="Button stuga-primary-color mt-10"
                onClick={onUpdate}
            >
                Update lambda
            </button>
        </>
    );
}
