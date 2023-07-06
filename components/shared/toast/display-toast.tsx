import toast, {
    DefaultToastOptions,
    Renderable,
    Toast,
    ToastOptions,
    ValueOrFunction,
} from "react-hot-toast";

export type ToastType = "success" | "error" | "loading" | "custom" | "promise";

type Message = ValueOrFunction<Renderable, Toast>;
export const DisplayToast = ({
    message,
    duration,
    type,
    custom,
    options,
    promise,
}: {
    message: string;
    duration?: number;
    type?: ToastType;
    custom?: Message;
    options?: ToastOptions;
    promise?: {
        prom: Promise<any>;
        msgs: {
            loading: Renderable;
            success: ValueOrFunction<Renderable, unknown>;
            error: ValueOrFunction<Renderable, any>;
        };
        opts?: DefaultToastOptions | undefined;
    };
}) => {
    switch (type) {
        // Custom all to have a close button
        case "success":
            // toast.success(message, { duration: duration ?? 5000, ...options });
            toast((t) => (
                <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-row items-center justify-start">
                        <span className="mr-2">
                            {/* Green checkmark */}
                            <svg
                                fill="none"
                                className="h-5 w-5 text-green-500"
                                stroke="currentColor"
                                stroke-width="1.5"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                                ></path>
                            </svg>
                        </span>
                        <span className="mr-2">{message}</span>
                    </div>

                    <button
                        className="rounded-full p-1 hover:bg-gray-200"
                        onClick={() => toast.dismiss(t.id)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 11.414l4.95 4.95 1.414-1.414L11.414 10l4.95-4.95L14.95 3.636 10 8.586 5.05 3.636 3.636 5.05 8.586 10l-4.95 4.95L5.05 16.364 10 11.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>
            ));
            break;
        case "error":
            // toast.error(message, { duration: duration ?? 5000, ...options });
            toast((t) => (
                <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-row items-center justify-start">
                        <span className="mr-2">
                            {/* Red cross */}
                            <svg
                                fill="none"
                                className="h-5 w-5 text-red-500"
                                stroke="currentColor"
                                stroke-width="1.5"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                ></path>
                            </svg>
                        </span>
                        <span className="mr-2">{message}</span>
                    </div>

                    <button
                        className="rounded-full p-1 hover:bg-gray-200"
                        onClick={() => toast.dismiss(t.id)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 11.414l4.95 4.95 1.414-1.414L11.414 10l4.95-4.95L14.95 3.636 10 8.586 5.05 3.636 3.636 5.05 8.586 10l-4.95 4.95L5.05 16.364 10 11.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>
            ));

            break;
        case "loading":
            toast((t) => (
                <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-row items-center justify-start">
                        <span className="mr-2">
                            {/* Red cross */}
                            <svg
                                fill="none"
                                className="h-5 w-5 animate-spin text-blue-500"
                                stroke="currentColor"
                                stroke-width="1.5"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                ></path>
                            </svg>
                        </span>
                        <span className="mr-2">{message}</span>
                    </div>

                    <button
                        className="rounded-full p-1 hover:bg-gray-200"
                        onClick={() => toast.dismiss(t.id)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 11.414l4.95 4.95 1.414-1.414L11.414 10l4.95-4.95L14.95 3.636 10 8.586 5.05 3.636 3.636 5.05 8.586 10l-4.95 4.95L5.05 16.364 10 11.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>
            ));
            break;
        case "custom":
            if (!custom) throw new Error("Invalid custom toast");
            toast.custom(custom, { duration: duration ?? 5000, ...options });
        case "promise":
            if (!promise) throw new Error("Invalid promise toast");
            toast.promise(promise.prom, promise.msgs, promise.opts);
        default:
            throw new Error("Invalid toast type");
    }
};
