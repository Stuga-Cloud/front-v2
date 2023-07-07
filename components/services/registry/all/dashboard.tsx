import { Namespace } from "../../../../lib/models/registry/namespace";
import { DropdownAction } from "../dropdown-action";
import { toastEventEmitter } from "@/lib/event-emitter/toast-event-emitter";
import { useState } from "react";
import { LoadingSpinner } from "@/components/shared/icons";
import { DeleteNamespace } from "../../../../lib/services/registry/namespace/delete-namespace";
import { DisplayToast } from "@/components/shared/toast/display-toast";

export default function Dashboard({
    projectId,
    namespaces,
    onClick,
    afterDelete,
}: {
    projectId: string;
    namespaces: Namespace[];
    onClick: (namespaceId: string) => void;
    afterDelete: () => Promise<void>;
}) {
    const [loading, setLoading] = useState(false);
    const deleteNamespace = async (namespaceId: string, projectId: string) => {
        setLoading(true);
        try {
            await DeleteNamespace(namespaceId, projectId);
            // toastEventEmitter.emit("pop", {
            //     type: "success",
            //     mesage: "Namespace deleted successfully",
            //     duration: 2000,
            // });
            DisplayToast({
                type: "success",
                message: "Namespace deleted successfully",
                duration: 4000,
            });
            await afterDelete();
        } catch (error) {
            // toastEventEmitter.emit("pop", {
            //     type: "danger",
            //     message: "Failed to delete namespace",
            //     duration: 2000,
            // });
            DisplayToast({
                type: "error",
                message: "Failed to delete namespace",
                duration: 4000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading ? (
                <div className="flex h-[50vh] items-center justify-center">
                    <LoadingSpinner />
                </div>
            ) : (
                <div className="flex w-4/5 justify-center">
                    <div className="w-full text-gray-500 shadow-md sm:rounded-lg">
                        <table className="w-full text-left text-sm text-gray-500">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        namespace name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        accessibility
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        endpoint
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        last modification (UTC)
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        created at (UTC)
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {namespaces.map((namespace) => (
                                    <tr
                                        key={namespace.id}
                                        className="cursor-pointer border-b  bg-gray-100  hover:bg-gray-50 "
                                    >
                                        <th
                                            scope="row"
                                            className="whitespace-nowrap px-6 py-4 font-medium"
                                            onClick={() =>
                                                onClick(namespace.id)
                                            }
                                        >
                                            {namespace.name}
                                        </th>
                                        <td
                                            className="px-6 py-4"
                                            onClick={() =>
                                                onClick(namespace.id)
                                            }
                                        >
                                            {namespace.state}
                                        </td>
                                        <td
                                            className="px-6 py-4"
                                            onClick={() =>
                                                onClick(namespace.id)
                                            }
                                        >
                                            {
                                                process.env
                                                    .NEXT_PUBLIC_BASE_REGISTRY_ENDPOINT
                                            }
                                            {"/"}
                                            {namespace.name}
                                        </td>
                                        <td
                                            className="px-6 py-4"
                                            onClick={() =>
                                                onClick(namespace.id)
                                            }
                                        >
                                            {namespace.modifiedAt}
                                        </td>
                                        <td
                                            className="px-6 py-4"
                                            onClick={() =>
                                                onClick(namespace.id)
                                            }
                                        >
                                            {new Date(namespace.createdAt).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <a
                                                href="#"
                                                className="font-medium text-blue-600 hover:underline"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    console.log(
                                                        "je déclenche l'action",
                                                    );
                                                }}
                                            >
                                                <DropdownAction
                                                    messagePopup="Are you sure you want to delete this namespace?"
                                                    deleteAction={async () =>
                                                        await deleteNamespace(
                                                            namespace.id,
                                                            projectId,
                                                        )
                                                    }
                                                />
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    );
}
