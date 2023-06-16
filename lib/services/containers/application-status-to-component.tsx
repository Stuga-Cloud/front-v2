import { ContainerApplicationStatus } from "@/lib/models/containers/container-application";

export const applicationStatusToComponent = (
    status: ContainerApplicationStatus,
): string | JSX.Element => {
    switch (status) {
        case "AVAILABLE":
            return (
                <span className="inline-flex rounded-full bg-green-100 px-2 text-center text-xs font-semibold leading-5 text-green-800">
                    Available ✅
                </span>
            );
        case "PROGRESSING":
            return (
                <span className="inline-flex rounded-full bg-yellow-100 px-2 text-center text-xs font-semibold leading-5 text-yellow-800">
                    Progressing 🚧
                </span>
            );
        case "REPLICA_FAILURE":
            return (
                <span className="inline-flex rounded-full bg-red-100 px-2 text-center text-xs font-semibold leading-5 text-red-800">
                    Replica failure ❌
                </span>
            );
        default:
            return (
                <span className="inline-flex rounded-full bg-gray-100 px-2 text-center text-xs font-semibold leading-5 text-gray-800">
                    Unknown ❓
                </span>
            );
    }
};
