import { Image } from "./namespace-detail";

export default function DetailDashboard({
    images,
    onClick,
}: {
    images: Image[];
    onClick: (namespaceId: string) => void;
}) {
    return (
        <div className="flex w-4/5 justify-center">
            <div className="w-full text-gray-500 shadow-md dark:text-gray-400 sm:rounded-lg">
                <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-700  dark:text-gray-400">
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
                                className="cursor-pointer border-b  bg-gray-100  hover:bg-gray-50 dark:border-gray-200 dark:hover:bg-gray-200"
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
                                    { Math.round(image.size / 1000000)} MB
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
                                        className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            console.log(
                                                "je déclenche l'action",
                                            );
                                        }}
                                    >
                                        Actions
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
