import { useState } from "react";

export default function TabsImages({
    onClick,
}: {
    onClick: (tab: "settings" | "dashboard" | "access") => void;
}) {
    const [activeTab, setActiveTab] = useState<
        "dashboard" | "settings" | "access"
    >("dashboard");
    const handleClick = (tab: "settings" | "dashboard" | "access") => {
        onClick(tab);
        setActiveTab(tab);
    };

    return (
        <div className="mb-3 w-4/5 border-b border-gray-200 dark:border-gray-700">
            <ul className="-mb-px flex flex-wrap text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                <li className="mr-2">
                    <a
                        href="#"
                        className={`group inline-flex rounded-t-lg p-4 ${
                            activeTab === "dashboard"
                                ? "border-b-2 border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500"
                                : "border-transparent hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
                        }`}
                        aria-current="page"
                        onClick={() => handleClick("dashboard")}
                    >
                        <svg
                            aria-hidden="true"
                            className={`mr-2 h-5 w-5 ${
                                activeTab === "dashboard"
                                    ? "text-blue-600 dark:text-blue-500"
                                    : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                        </svg>
                        Dashboard
                    </a>
                </li>

                <li className="mr-2">
                    <a
                        href="#"
                        className={`group inline-flex rounded-t-lg p-4 ${
                            activeTab === "access"
                                ? "border-b-2 border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500"
                                : "border-transparent hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
                        }`}
                        onClick={() => handleClick("access")}
                    >
                        <svg
                            aria-hidden="true"
                            className={`mr-2 h-5 w-5 ${
                                activeTab === "access"
                                    ? "text-blue-600 dark:text-blue-500"
                                    : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                        Access
                    </a>
                </li>
                <li className="mr-2">
                    <a
                        href="#"
                        className={`group inline-flex rounded-t-lg p-4 ${
                            activeTab === "settings"
                                ? "border-b-2 border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500"
                                : "border-transparent hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
                        }`}
                        onClick={() => handleClick("settings")}
                    >
                        <svg
                            aria-hidden="true"
                            className={`mr-2 h-5 w-5 ${
                                activeTab === "settings"
                                    ? "text-blue-600 dark:text-blue-500"
                                    : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"></path>
                        </svg>
                        Settings
                    </a>
                </li>
            </ul>
        </div>
    );
}
