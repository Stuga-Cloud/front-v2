import {
    LambdaCPULimit,
    LambdanMemoryLimit as LambdaMemoryLimit,
    Step,
} from "../types/lambda-create";
export const cpuLimitsChoices: LambdaCPULimit[] = [
    { value: 70, unit: "mCPU" },
    { value: 140, unit: "mCPU" },
    { value: 280, unit: "mCPU" },
    { value: 560, unit: "mCPU" },
    { value: 1120, unit: "mCPU" },
    { value: 1680, unit: "mCPU" },
    { value: 2240, unit: "mCPU" },
];
export const memoryLimitsChoices: LambdaMemoryLimit[] = [
    { value: 128, unit: "MB" },
    { value: 256, unit: "MB" },
    { value: 512, unit: "MB" },
    { value: 1024, unit: "MB" },
    { value: 2048, unit: "MB" },
    { value: 4096, unit: "MB" },
];

export const stepsBase: Step[] = [
    {
        name: "Lambda name",
        description: "Enter your lambda name",
        svgPath: (
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
            ></path>
        ),
    },
    {
        name: "Image",
        description: "Set lambda image to deploy",
        svgPath: (
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            ></path>
        ),
    },
    {
        name: "Environment variables",
        description: "Set environment variables",
        svgPath: (
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
            ></path>
        ),
    },
    {
        name: "Confidentiality",
        description: "Set lambda confidentiality",
        svgPath: (
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
            ></path>
        ),
    },
    {
        name: "Lambda specifications",
        description: "CPU & Memory & Timeout",
        svgPath: (
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5"
            ></path>
        ),
    },
    {
        name: "Lambda Scalability limits",
        description:
            "Select the min instance number and the max instance number",
        svgPath: (
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z"
            ></path>
        ),
    },
    // {
    //     name: "Price",
    //     description:
    //         "See price estimation of your configuration before deploying",
    //     svgPath: (
    //         <path
    //             strokeLinecap="round"
    //             d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25"
    //         ></path>
    //     ),
    // },
];
