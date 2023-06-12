import { time } from "console";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { LambdaCPULimit, LambdaMemoryLimit } from "@/lib/models/lambdas/lambda-create";
import { useState } from "react";

export default function LambdaSettingsForm({
    cpuChoices,
    memoryChoices,
    cpuConfig,
    memoryConfig,
    timeout,
    onChange,
}: {
    cpuChoices: LambdaCPULimit[];
    memoryChoices: LambdaMemoryLimit[];
    cpuConfig: LambdaCPULimit;
    memoryConfig: LambdaMemoryLimit;
    timeout: number;
    onChange: (
        cpuConfig: LambdaCPULimit,
        memoryConfig: LambdaMemoryLimit,
        timeout: number,
    ) => void;
}) {
    const isTimeoutValid = (timeout: number) => {
        return timeout >= 1 && timeout <= 600;
    };
    return (
        <div className="mb-10 flex min-h-96 w-full flex-col">
            <label
                htmlFor="cpu-limit"
                className="mb-2 block text-sm font-medium text-gray-900 "
            >
                CPU Limit (milliCPU)
            </label>
            <select
                className="bg-gray-40 mb-2 block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500"
                onChange={(e) => {
                    const valueSplit = e.target.value.split("m");
                    console.log(valueSplit);
                    const cpuLimit = {value: parseInt(valueSplit[0]), unit: 'mCPU' }
                    console.log('cpuLimit');
                    console.log(cpuLimit);
                    onChange(cpuLimit as LambdaCPULimit, memoryConfig, timeout);
                }}
                value={`${cpuConfig.value}${cpuConfig.unit}`}
            >
                {cpuChoices.map((choice) => (
                    <option
                        key={choice.value}
                        value={`${choice.value}${choice.unit}`}
                    >
                        {choice.value} {choice.unit}
                    </option>
                ))}
            </select>
            <label
                htmlFor="memory-limit"
                className="mb-2 mt-5 block text-sm font-medium text-gray-900 "
            >
                Memory Limit (MB)
            </label>
            <select
                className="bg-gray-40 mb-2 block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 "
                onChange={(e) => {
                    const valueSplit = e.target.value.split(" ");
                    const memoryLimit = {value: parseInt(valueSplit[0]), unit: valueSplit[1] }
                    onChange(cpuConfig, memoryLimit as LambdaMemoryLimit, timeout);
                }}
                value={`${memoryConfig.value}${memoryConfig.unit}`}
            >
                {memoryChoices.map((choice) => (
                    <option
                        key={choice.value}
                        value={`${choice.value}${choice.unit}`}
                    >
                        {choice.value} {choice.unit}
                    </option>
                ))}
            </select>
            <div className="mt-5 flex flex-col">
                <label
                    htmlFor="cpuUsage"
                    className={
                        "mb-2 block text-sm font-medium text-gray-900" +
                        (isTimeoutValid(timeout) ? "gray-900 " : "red-700 ")
                    }
                >
                    Timeout (seconds)
                </label>
                <input
                    id="cpuUsage"
                    type="number"
                    className={`bg-gray-40 mb-1 block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 ${
                        !isTimeoutValid(timeout)
                            ? "border-red-500 bg-red-50 p-2.5 text-sm text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 "
                            : ""
                    }`}
                    value={timeout}
                    onChange={(e) =>
                        onChange(
                            cpuConfig,
                            memoryConfig,
                            Number(e.target.value),
                        )
                    }
                    placeholder="Enter CPU Usage Threshold"
                    min="0"
                    max="100"
                    required
                />
                <div className="mb-10  flex flex-row items-center">
                    <InfoCircledIcon />
                    <p className="ms-2 text-sm text-gray-500">
                        After this time the lambda will be terminated. It will
                        help you to avoid unexpected costs.
                    </p>
                </div>
                {!isTimeoutValid(timeout) ? (
                    <p className="mt-2 text-sm text-red-600 ">
                        Please enter a valid number between 1 and 600.
                    </p>
                ) : null}
            </div>
        </div>
    );
}
