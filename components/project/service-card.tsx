import Image from "next/image";

export default function ServiceCard({
    title,
    description,
    imageName,
    onClick,
}: {
    title: string;
    description: string;
    imageName: string;
    onClick: () => void;
}) {
    return (
        <div
            className="min-w-sm dark:bg-grey-200 mt-8 w-2/5 rounded-lg bg-white p-6 shadow dark:border-green-700"
            onClick={onClick}
        >
            <Image
                src={`/${imageName}`}
                alt="docker picture"
                width="60"
                height="60"
                className="ms-5"
            ></Image>
            <a href="#">
                <h5 className="mb-2 ms-5 text-2xl font-semibold tracking-tight text-gray-400 dark:text-gray-400">
                    {title}
                </h5>
            </a>
            <p className="mb-3 ms-5 font-normal text-gray-500 dark:text-gray-400">
                {description}
            </p>
            <a
                href="#"
                className="ms-5 inline-flex items-center text-blue-600 hover:underline"
                onClick={onClick}
            >
                Go to service
                <svg
                    className="ml-2 h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
                </svg>
            </a>
        </div>
    );
}
