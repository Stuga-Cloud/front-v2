import { InfoCircledIcon } from "@radix-ui/react-icons";

export default function LambdaNameForm({
    isLambdaNameValid,
    name,
    handleChangeName,
}: {
    isLambdaNameValid: (name: string) => boolean;
    name: string;
    handleChangeName: (name: string) => void;
}) {
    return (
        <div className="mb-10 ms-5 flex h-96 w-full flex-col">
            <div className="mb-2 ms-5 flex flex-col">
                <div className="mb-1 flex flex-col">
                    <label
                        htmlFor="applicationName"
                        className={
                            `pb-1 text-sm font-medium text-gray-700` +
                            (!isLambdaNameValid(name)
                                ? "gray-900"
                                : "red-700")
                        }
                    >
                        Lambda Name
                    </label>
                    <input
                        className={`bg-gray-40 mb-2 block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500  ${
                            !isLambdaNameValid(name)
                                ? "border-red-500 bg-red-50 p-2.5 text-sm text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 "
                                : ""
                        }`}
                        type="text"
                        value={name}
                        onChange={(e) => {
                            handleChangeName(e.target.value);
                        }}
                        placeholder="my-first-application"
                    />
                    {!isLambdaNameValid(name) && (
                        <p className="text-sm text-red-500">
                            Please enter a valid lambda name.
                        </p>
                    )}
                </div>
                <div className="flex flex-row items-center gap-2">
                    <InfoCircledIcon />
                    <p className="text-sm font-semibold text-gray-500">
                        The lambda name can only contain alphanumeric
                        characters.
                    </p>
                </div>
                {name && isLambdaNameValid(name) && (
                    <div className="flex flex-col items-center gap-2">
                        {/* Recap of the final URL where the application will be available */}
                        <h4 className="pt-12 text-2xl font-bold">
                            Your lambda will be available at:
                        </h4>
                        <a
                            className="text-1xl font-semibold leading-normal text-blue-800"
                            href={`https://${name}.pomme.${process.env.NEXT_PUBLIC_BASE_CONTAINER_DOMAIN}`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            https://
                            {name}.pomme.
                            {process.env.NEXT_PUBLIC_BASE_CONTAINER_DOMAIN}
                        </a>
                        <p className="text-sm font-semibold text-gray-500">
                            (This URL will be available once you have completed
                            the next steps)
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
