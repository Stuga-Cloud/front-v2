import { LoadingSpinner } from "@/components/shared/icons";
import { Lambda } from "@prisma/client";
import { useState } from "react";
import { DropdownActionLambda } from "./lambda-dropdown-action";
import { DeleteLambda } from "@/lib/services/lambdas/client/delete-lambda";
import { toastEventEmitter } from "@/lib/event-emitter/toast-event-emitter";
import { DisplayToast } from "@/components/shared/toast/display-toast";

export default function LambdasDashboard({
    lambdas,
    projectId,
    onClick,
    afterDelete,
}: {
    lambdas: Lambda[];
    projectId: string;
    onClick: (lambda: Lambda) => void;
    afterDelete: () => Promise<void>;
}) {
    const [loading, setLoading] = useState(false);

    const deleteLambda = async (lambdaId: string, projectId: string) => {
        setLoading(true);
        try {
            await DeleteLambda({ lambdaId, projectId });
            console.log("print after delete")
            await afterDelete();
            // toastEventEmitter.emit("pop", {
            //     type: "success",
            //     mesage: "lambda deleted successfully",
            //     duration: 5000,
            // });
            DisplayToast({
                type: "success",
                message: "lambda deleted successfully",
                duration: 4000,
            });
        } catch (error) {
            // toastEventEmitter.emit("pop", {
            //     type: "danger",
            //     message: "Failed to delete lambda",
            //     duration: 2000,
            // });
            DisplayToast({
                type: "error",
                message: "Failed to delete lambda",
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
                    <LoadingSpinner size="large" />
                </div>
            ) : (
                <div className="flex w-4/5 justify-center">
                    <div className="shadow-mdsm:rounded-lg w-full text-gray-500">
                        <table className="w-full text-left text-sm text-gray-500">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        lambda name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        image name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        visibility
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        access lambda
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        cpu
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        memory
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
                                {lambdas.map((lambda) => (
                                    <tr
                                        key={lambda.id}
                                        className="cursor-pointer border-b  bg-gray-100  hover:bg-gray-50"
                                    >
                                        <th
                                            scope="row"
                                            className="whitespace-nowrap px-6 py-4 font-medium"
                                            onClick={() => onClick(lambda)}
                                        >
                                            {lambda.name}
                                        </th>
                                        <td
                                            className="px-6 py-4"
                                            onClick={() => onClick(lambda)}
                                        >
                                            {lambda.imageName}
                                        </td>
                                        <td
                                            className="px-6 py-4"
                                            onClick={() => onClick(lambda)}
                                        >
                                            {lambda.visibility}
                                        </td>
                                        <td
                                            className="px-6 py-4"
                                            onClick={() => onClick(lambda)}
                                        >
                                            {lambda.urlAccess}
                                        </td>
                                        <td
                                            className="px-6 py-4"
                                            onClick={() => onClick(lambda)}
                                        >
                                            {lambda.cpuLimitmCPU} mCPU
                                        </td>
                                        <td
                                            className="px-6 py-4"
                                            onClick={() => onClick(lambda)}
                                        >
                                            {lambda.memoryLimitMB} MB
                                        </td>
                                        <td
                                            className="px-6 py-4"
                                            onClick={() => onClick(lambda)}
                                        >
                                            {new Date(
                                                lambda.createdAt as unknown as string,
                                            ).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <a
                                                href="#"
                                                className="font-medium text-blue-600 hover:underline "
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    console.log(
                                                        "je déclenche l'action",
                                                    );
                                                }}
                                            >
                                                <DropdownActionLambda
                                                    messagePopup="Are you sure you want to delete this lambda?"
                                                    deleteAction={async () =>
                                                        await deleteLambda(
                                                            lambda.id,
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
