import { useState } from "react";

export default function LambdaStepper({
    steps,
    activeStep,
    handleChangeActiveStep,
}: {
    steps: Step[];
    activeStep: number;
    handleChangeActiveStep: (step: number) => void;
}) {
    return (
        <div>
            <ol className="relative border-l border-gray-200 text-gray-500 ">
                {steps.length <= 0 && (
                    <div className="flex flex-col items-center justify-center">
                        <p className="text-gray-500">No steps found</p>
                        <p className="text-gray-500">
                            Please add steps in the configuration file
                        </p>
                    </div>
                )}
                {steps.length > 0 &&
                    steps.map((stepItem, index) => (
                        <a
                            className=""
                            key={index}
                            onClick={() => {
                                handleChangeActiveStep(index + 1);
                            }}
                            href="#step-name"
                        >
                            <li
                                key={index}
                                className={`mb-10 ml-6 ${
                                    activeStep === index + 1
                                        ? "text-green-500"
                                        : "text-gray-500"
                                }`}
                            >
                                <span
                                    className={`absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 ring-4 ring-white ${
                                        activeStep === index + 1
                                            ? "bg-green-200"
                                            : "bg-white"
                                    }`}
                                >
                                    {/* TODO Maybe display check if fields are validate in steps  ? */}
                                    {/*{step === index + 1 ? (*/}
                                    {/*    <svg*/}
                                    {/*        aria-hidden="true"*/}
                                    {/*        className="h-5 w-5 text-green-500 dark:text-green-400"*/}
                                    {/*        fill="currentColor"*/}
                                    {/*        viewBox="0 0 20 20"*/}
                                    {/*        xmlns="http://www.w3.org/2000/svg"*/}
                                    {/*    >*/}
                                    {/*        <path*/}
                                    {/*            fillRule="evenodd"*/}
                                    {/*            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"*/}
                                    {/*            clipRule="evenodd"*/}
                                    {/*        />*/}
                                    {/*    </svg>*/}
                                    {/*) : (*/}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="white"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        className="h-6 w-6 text-gray-500"
                                    >
                                        {stepItem.svgPath}
                                    </svg>
                                    {/*)}*/}
                                </span>
                                <h3 className="font-medium leading-tight">
                                    {index + 1} - {stepItem.name}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {stepItem.description}
                                </p>
                            </li>
                        </a>
                    ))}
            </ol>
        </div>
    );
}
