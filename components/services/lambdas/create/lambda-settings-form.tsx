import { LambdaCPULimit, LambdanMemoryLimit } from "./types/lambda-create";

export default function LambdaSettingsForm({
    cpuChoices,
    memoryChoices,
    cpuConfig,
    memoryConfig,
    onChange,
}: {
    cpuChoices: LambdaCPULimit[];
    memoryChoices: LambdanMemoryLimit[];
    cpuConfig: string;
    memoryConfig: string;
    onChange: (cpuConfig: string, memoryConfig: string) => void;
}) {
    return (
        <div className="mb-10 ms-5 flex h-96 w-full flex-col">
            <label
                htmlFor="cpu-limit"
                className="mb-2 block text-sm font-medium text-gray-900 "
            >
                CPU Limit (milliCPU)
            </label>
            <select
                className="bg-gray-40 mb-2 block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500"
                value={cpuConfig}
                onChange={(e) => {
                    onChange(e.target.value, memoryConfig);
                }}
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
                className="mb-2 mt-3 block text-sm font-medium text-gray-900 "
            >
                Memory Limit (MB)
            </label>
            <select
                className="bg-gray-40 mb-2 block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 "
                value={memoryConfig}
                onChange={(e) => {
                    onChange(cpuConfig, e.target.value);
                }}
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
        </div>
    );
}
