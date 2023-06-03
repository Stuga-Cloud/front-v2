import { useState } from "react";
import { CodeBlock, nord } from "react-code-blocks";
import CopyToClipboard from "react-copy-to-clipboard";

export default function DockerLoginCode({ code }: { code: string }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Dismiss after 2 seconds
    };
    return (
        <div style={{ position: "relative" }}>
            <CodeBlock
                text={code}
                language={"bash"}
                showLineNumbers={false}
                theme={nord}
            />
            <CopyToClipboard text={code}>
                <button
                    aria-label="Copy to clipboard"
                    className="absolute right-2 top-2 cursor-pointer border-none bg-transparent text-white"
                    onClick={handleCopy}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24"
                        viewBox="0 0 24 24"
                        width="24"
                        className="bg-white text-white"
                    >
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path d="M8 8H6v9h10V8h-2V3H8v5zm-2 0V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v5H6zm3 3h4v4h-4v-4z" />
                    </svg>
                </button>
            </CopyToClipboard>
            {copied && (
                <div className="absolute right-2 top-10 z-10 rounded bg-gray-500 px-2 py-1 text-sm text-white">
                    Copied!
                </div>
            )}
        </div>
    );
}
