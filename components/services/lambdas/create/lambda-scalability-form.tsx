export default function LambdaScalabilityForm({
    minInstanceNumber,
    maxInstanceNumber,
    isMinInstanceNumberValid,
    isMaxInstanceNumberValid,
    setMinInstanceNumber,
    setMaxInstanceNumber,
}: {
    minInstanceNumber: number;
    maxInstanceNumber: number;
    isMinInstanceNumberValid: (cpuUsageThreshold: number) => boolean;
    isMaxInstanceNumberValid: (cpuUsageThreshold: number) => boolean;
    setMinInstanceNumber: (minInstanceNumber: number) => void;
    setMaxInstanceNumber: (maxInstanceNumber: number) => void;
}) {
    return (
        <div className="mb-10 ms-5 flex min-h-96 w-full flex-col">
            <div className="mb-6 ms-5 flex flex-col">
                {/* Display a message that explains the autoscaling feature */}
                <p className="mt-2 text-sm text-gray-500 ">
                    Your lambda will automatically scale up or down based on the
                    number of requests it receives.
                </p>
            </div>
            <div className="mb-10 ms-5 flex flex-col">
                <div className="mb-2 flex flex-col">
                    <label
                        htmlFor="minInstance"
                        className={
                            "mb-2 block text-sm font-medium" +
                            (isMinInstanceNumberValid(minInstanceNumber)
                                ? "gray-900 "
                                : "red-700 ")
                        }
                    >
                        Min Instance Number
                    </label>
                    <input
                        id="minInstance"
                        type="number"
                        className={`bg-gray-40 mb-1 block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 ${
                            !isMinInstanceNumberValid(minInstanceNumber)
                                ? "border-red-500 bg-red-50 p-2.5 text-sm text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 "
                                : ""
                        }`}
                        value={minInstanceNumber}
                        onChange={(e) => setMinInstanceNumber(Number(e.target.value))}
                        placeholder="Enter Min instance number"
                        min="0"
                        max="10"
                        required
                    />
                    {!isMinInstanceNumberValid(minInstanceNumber) ? (
                        <p className="mt-2 text-sm text-red-600 ">
                            Please enter a valid number between 0 and 10 and not greater than max instance number.
                        </p>
                    ) : null}
                </div>

                <div className="mb-2 flex flex-col">
                    <label
                        htmlFor="maxInstance"
                        className={
                            "mb-2 block text-sm font-medium" +
                            (isMaxInstanceNumberValid(maxInstanceNumber)
                                ? "gray-900 "
                                : "red-700 ")
                        }
                    >
                        Max Instance Number
                    </label>
                    <input
                        id="maxInstance"
                        type="number"
                        className={`bg-gray-40 mb-1 block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500  ${
                            !isMaxInstanceNumberValid(maxInstanceNumber)
                                ? "border-red-500 bg-red-50 p-2.5 text-sm text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 "
                                : ""
                        }`}
                        value={maxInstanceNumber}
                        onChange={(e) => setMaxInstanceNumber(Number(e.target.value))}
                        placeholder="Enter Max instance number"
                        min="0"
                        max="10"
                        required
                    />
                    {!isMaxInstanceNumberValid(maxInstanceNumber) ? (
                        <p className="mt-2 text-sm text-red-600 ">
                            Please enter a valid number between 0 and 10 and not less than min instance number.
                        </p>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
