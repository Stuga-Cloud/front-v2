import { useState } from "react";
import RadioButtons from "./radio-buttons";
import { InfoCircledIcon } from "@radix-ui/react-icons";

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
    value: "public" | "private";
    handleVisibilityChange: (value: "public" | "private") => void;
}) {
    const [apiKey, setApiKey] = useState<string | null>(null);
    return (
        <>
            <RadioButtons
                onChangeValue={(value: string) => {
                    console.log("value");
                    console.log(value);
                    handleVisibilityChange(value as "public" | "private");
                }}
            />
            {value === "private" && (
                <>
                    <div className="mt-4 flex flex-row items-center">
                        <InfoCircledIcon />
                        <p className="text-sm text-gray-500 ms-2">
                            Private lambdas are only visible to you and your
                            team.
                        </p>
                    </div>
                    <h4 className="mt-20 text-xl font-bold">
                        Generate an API key
                    </h4>
                    <div className="mt-4 mb-10 flex flex-row items-center">
                        <InfoCircledIcon />
                        <p className="text-sm text-gray-500">
                            You can access you lambda with the following API key
                        </p>
                    </div>
                    <button
                        type="button"
                        className="Button stuga-primary-color w-fit"
                        onClick={async () => {
                            const key = await generateApiKey();
                            setApiKey(key);
                        }}
                    >
                        Generate API key
                    </button>
                    {apiKey && (
                        <div className="mt-4 border-2 border-green-500 rounded-lg p-5 bg-white">
                            <p className="text-m text-gray-500 font-bold">{apiKey}</p>
                        </div>
                    )}
                </>
            )}
        </>
    );
}
