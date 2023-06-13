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
        case "success":
            toast.success(message, { duration: duration ?? 5000, ...options });
            break;
        case "error":
            toast.error(message, { duration: duration ?? 5000, ...options });
            break;
        case "loading":
            toast.loading(message, { duration: duration ?? 5000, ...options });
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
