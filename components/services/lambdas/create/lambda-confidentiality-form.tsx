import { useState } from "react";
import RadioButtons from "./radio-buttons";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { LambdaVisibility } from "@/lib/models/lambdas/lambda-create";

function arrayBufferToBase64(buffer: ArrayBuffer): string {
    return btoa(
        new Uint8Array(buffer).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            "",
        ),
    );
}

async function generateApiKey(): Promise<string> {
    const array = new Uint8Array(30); // Génère une clé d'API de 40 caractères une fois codée en base64
    window.crypto.getRandomValues(array);
    return arrayBufferToBase64(array.buffer);
}

export default function LambdaConfidentialityForm({
    value,
    handleVisibilityChange,
}: {
    value: LambdaVisibility;
    handleVisibilityChange: (lambdaVisibility: LambdaVisibility) => void;
}) {
    const [apiKey, setApiKey] = useState<string | null>(
        value.access?.apiKey || null,
    );
    return (
        <div className="mb-10 ms-5 flex min-h-96 w-full flex-col">
            <RadioButtons
                value={value.visibility}
                onChangeValue={(value: string) => {
                    if (value === "private" && apiKey) {
                        handleVisibilityChange({
                            visibility: "private",
                            access: {
                                mode: "apiKey",
                                apiKey,
                            },
                        });
                    } else {
                        handleVisibilityChange({
                            visibility: value as "public" | "private",
                        });
                    }
                }}
            />
            {value.visibility === "public" && (
                <div className="mt-4 flex flex-row items-center">
                    <InfoCircledIcon />
                    <p className="ms-2 text-sm text-gray-500">
                        Public lambdas can be accessed by anyone.
                    </p>
                </div>
            )}
            {value.visibility === "private" && (
                <>
                    <div className="mt-4 flex flex-row items-center">
                        <InfoCircledIcon />
                        <p className="ms-2 text-sm text-gray-500">
                            Private lambdas are only visible to you and your
                            team.
                        </p>
                    </div>
                    <h4 className="mt-20 text-xl font-bold">
                        Access with an API key
                    </h4>
                    <div className="mb-10 mt-4 flex flex-row items-center">
                        <InfoCircledIcon />
                        <p className="ms-2 text-sm text-gray-500">
                            You can access you lambda with the following API key
                        </p>
                    </div>
                    {value.access?.apiKey === undefined ? (
                        <div className="mt-4 rounded-lg border-2 border-green-500 bg-white p-5">
                            <p className="text-m font-bold text-gray-500">
                                We will generate an api key for you at the creation step
                            </p>
                        </div>
                    ) : (
                        <div className="mt-4 rounded-lg border-2 border-green-500 bg-white p-5">
                            <p className="text-m font-bold text-gray-500">
                                {apiKey}
                            </p>
                        </div>
                    )}
                    {/* <button
                        type="button"
                        className="Button stuga-primary-color w-fit"
                        onClick={async () => {
                            const key = await generateApiKey();
                            setApiKey(key);
                            if (key) {
                                handleVisibilityChange({
                                    visibility: "private",
                                    access: {
                                        mode: "apiKey",
                                        apiKey: key,
                                    },
                                });
                            }
                        }}
                    >
                        Generate API key
                    </button>
                    {apiKey && (
                        <div className="mt-4 rounded-lg border-2 border-green-500 bg-white p-5">
                            <p className="text-m font-bold text-gray-500">
                                {apiKey}
                            </p>
                        </div>
                    )} */}
                </>
            )}
        </div>
    );
}
