import { Namespace } from "@/lib/models/registry/namespace";
import { DropdownAction } from "../dropdown-action";
import { Image } from "./namespace-detail";
import { Dispatch, SetStateAction } from "react";
import { toastEventEmitter } from "@/lib/event-emitter/toast-event-emitter";
import { deleteNamespaceImage } from "../../../../lib/services/registry/namespace/delete-namespace-image";
import { DisplayToast } from "@/components/shared/toast/display-toast";

export default function DetailDashboard({
    projectId,
    namespace,
    images,
    onClick,
    setLoading,
    afterDelete,
}: {
    projectId: string;
    namespace: Namespace;
    images: Image[];
    onClick: (namespaceId: string) => void;
    setLoading: Dispatch<SetStateAction<boolean>>;
    afterDelete: () => Promise<void>;
}) {
    return (
        <div className="flex w-4/5 justify-center">
            <div className="w-full text-gray-500 shadow-md sm:rounded-lg">
                <table className="w-full text-left text-sm text-gray-500 ">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-700  ">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                digest
                            </th>
                            <th scope="col" className="px-6 py-3">
                                name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                tag
                            </th>
                            <th scope="col" className="px-6 py-3">
                                size
                            </th>
                            <th scope="col" className="px-6 py-3">
                                creationTime (UTC)
                            </th>
                            <th scope="col" className="px-6 py-3">
                                pullCount
                            </th>
                            <th scope="col" className="px-6 py-3">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {images.map((image) => (
                            <tr
                                key={image.digest}
                                className="cursor-pointer border-b  bg-gray-100  hover:bg-gray-50 "
                            >
                                <th
                                    scope="row"
                                    className="whitespace-nowrap px-6 py-4 font-medium"
                                    onClick={() => onClick(image.name)}
                                >
                                    {image.digest}
                                </th>
                                <td
                                    scope="row"
                                    className="whitespace-nowrap px-6 py-4 font-medium"
                                    onClick={() => onClick(image.name)}
                                >
                                    {image.name}
                                </td>
                                <td
                                    className="px-6 py-4"
                                    onClick={() => onClick(image.digest)}
                                >
                                    {image.tag}
                                </td>
                                <td
                                    className="px-6 py-4"
                                    onClick={() => onClick(image.digest)}
                                >
                                    {Math.round(image.size / 1000000)} MB
                                </td>
                                <td
                                    className="px-6 py-4"
                                    onClick={() => onClick(image.digest)}
                                >
                                    {image.creationTime}
                                </td>
                                <td
                                    className="px-6 py-4"
                                    onClick={() => onClick(image.digest)}
                                >
                                    {image.pullCount}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <a
                                        href="#"
                                        className="font-medium text-blue-600 hover:underline "
                                        onClick={(e) => {
                                            e.preventDefault();
                                        }}
                                    >
                                        <DropdownAction
                                            messagePopup="Are you sure you want to delete this image ?"
                                            deleteAction={async () => {
                                                setLoading(true);
                                                try {
                                                    await deleteNamespaceImage({
                                                        projectId: projectId,
                                                        namespaceId:
                                                            namespace.id,
                                                        imageName: image.name,
                                                    });
                                                    await afterDelete();
                                                } catch (e) {
                                                    // toastEventEmitter.emit(
                                                    //     "pop",
                                                    //     {
                                                    //         type: "danger",
                                                    //         message:
                                                    //             "Error while deleting image",
                                                    //         duration: 5000,
                                                    //     },
                                                    // );
                                                    DisplayToast({
                                                        type: "error",
                                                        message:
                                                                "Error while deleting image",
                                                        duration: 4000,
                                                    });
                                                } finally {
                                                    setLoading(false);
                                                }
                                            }}
                                        />
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
