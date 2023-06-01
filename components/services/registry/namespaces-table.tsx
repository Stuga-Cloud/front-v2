export default function Namespaces() {
    return (
        <div className="flex justify-center">
            <div className="z-10 w-5/6 shadow-md sm:rounded-lg text-gray-500 dark:text-gray-400">
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
                                Category
                            </th>
                            <th scope="col" className="px-6 py-3">
                                created at
                            </th>
                            <th scope="col" className="px-6 py-3">
                                <span className="sr-only">Edit</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b bg-gray-100  dark:border-gray-200  dark:hover:bg-gray-200">
                            <th
                                scope="row"
                                className="whitespace-nowrap px-6 py-4 font-medium"
                            >
                                pomme
                            </th>
                            <td className="px-6 py-4">Private</td>
                            <td className="px-6 py-4">Laptop</td>
                            <td className="px-6 py-4">$2999</td>
                            <td className="px-6 py-4 text-right">
                                <a
                                    href="#"
                                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                                >
                                    Edit
                                </a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
