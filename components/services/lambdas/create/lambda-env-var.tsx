import { LambdaEnvironmentVariable } from "@/lib/models/lambdas/lambda-create";


export default function LambdaEnvVarForm({
    variables,
    handleAddEnvironmentVariable,
    handleRemoveEnvironmentVariable,
    handleEnvironmentVariableChange,
}: {
    variables: LambdaEnvironmentVariable[];
    handleAddEnvironmentVariable: () => void;
    handleRemoveEnvironmentVariable: (index: number) => void;
    handleEnvironmentVariableChange: (
        index: number,
        whereToChange: "name" | "value",
        value: string,
    ) => void;
}) {
    console.log("env var form")
    console.log(variables)
    return (
        <div className="mb-10 ms-5 flex min-h-96  w-full flex-col">
            <label
                htmlFor="environment-variables"
                className="mb-2 block text-sm font-medium text-gray-900 "
            >
                Environment Variables :
            </label>
            <div>
                {variables.map((variable, index) => (
                    <div key={index} className="mb-2 flex items-center">
                        <input
                            type="text"
                            className="bg-gray-40 mb-2 block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500"
                            placeholder="Key"
                            value={variable.name}
                            onChange={(e) =>
                                handleEnvironmentVariableChange(
                                    index,
                                    "name",
                                    e.target.value,
                                )
                            }
                        />
                        <span className="mx-2">→</span>
                        <input
                            type="text"
                            className="bg-gray-40 mb-2 block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 "
                            placeholder="Value"
                            value={variable.value}
                            onChange={(e) =>
                                handleEnvironmentVariableChange(
                                    index,
                                    "value",
                                    e.target.value,
                                )
                            }
                        />
                        <button
                            className="Button stuga-red-color mx-3"
                            onClick={() =>
                                handleRemoveEnvironmentVariable(index)
                            }
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>
            <button
                type="button"
                className="Button stuga-primary-color w-fit"
                onClick={() => handleAddEnvironmentVariable()}
            >
                Add Environment Variable
            </button>
        </div>
    );
}
