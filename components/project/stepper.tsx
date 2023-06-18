export const ValidStepper = ({
    text,
    index,
}: {
    text: string;
    index: number;
}) => {
    return (
        <li>
            <div
                className="w-full rounded-lg border border-green-300 bg-green-50 p-4 text-green-700"
                role="alert"
            >
                <div className="flex items-center justify-between">
                    <span className="sr-only">{text}</span>
                    <h3 className="font-medium">
                        {index}. {text}
                    </h3>
                    <svg
                        aria-hidden="true"
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            </div>
        </li>
    );
};

export const ActiveStepper = ({
    text,
    index,
}: {
    text: string;
    index: number;
}) => {
    return (
        <li>
            <div
                className="w-full rounded-lg border border-blue-300 bg-blue-100 p-4 text-blue-700"
                role="alert"
            >
                <div className="flex items-center justify-between">
                    <span className="sr-only">{text}</span>
                    <h3 className="font-medium">
                        {index}. {text}
                    </h3>
                    <svg
                        aria-hidden="true"
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            </div>
        </li>
    );
};

export const PendingStepper = ({
    text,
    index,
}: {
    text: string;
    index: number;
}) => {
    return (
        <li>
            <div
                className="w-full rounded-lg border border-gray-300 bg-gray-100 p-4 text-gray-900"
                role="alert"
            >
                <div className="flex items-center justify-between">
                    <span className="sr-only">{text}</span>
                    <h3 className="font-medium">
                        {index}. {text}
                    </h3>
                </div>
            </div>
        </li>
    );
};
