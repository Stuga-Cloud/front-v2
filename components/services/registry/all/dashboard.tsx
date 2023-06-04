import { Dropdown } from "@/components/shared/dropdown";
import { Namespace } from "../../../../lib/models/registry/namespace";
import { DropdownAction } from "../dropdown-action";
export default function Dashboard({
    namespaces,
    onClick,
}: {
    namespaces: Namespace[];
    onClick: (namespaceId: string) => void;
}) {
    return (
        <div className="flex w-4/5 justify-center">
            <div className="w-full text-gray-500 shadow-md dark:text-gray-400 sm:rounded-lg">
                <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-700  dark:text-gray-400">
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
                                className="cursor-pointer border-b  bg-gray-100  hover:bg-gray-50 dark:border-gray-200 dark:hover:bg-gray-200"
                            >
                                <th
                                    scope="row"
                                    className="whitespace-nowrap px-6 py-4 font-medium"
                                    onClick={() => onClick(namespace.id)}
                                >
                                    {namespace.name}
                                </th>
                                <td
                                    className="px-6 py-4"
                                    onClick={() => onClick(namespace.id)}
                                >
                                    {namespace.state}
                                </td>
                                <td
                                    className="px-6 py-4"
                                    onClick={() => onClick(namespace.id)}
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
                                    onClick={() => onClick(namespace.id)}
                                >
                                    {namespace.modifiedAt}
                                </td>
                                <td
                                    className="px-6 py-4"
                                    onClick={() => onClick(namespace.id)}
                                >
                                    {namespace.createdAt}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <a
                                        href="#"
                                        className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            console.log(
                                                "je déclenche l'action",
                                            );
                                        }}
                                    >
                                        <DropdownAction />
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
