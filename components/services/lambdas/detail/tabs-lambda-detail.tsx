import { useState } from "react";

export default function TabsLambdaDetail({
    tab,
    onClick,
}: {
    tab: "details" | "image" | "visibility" | "monitor";
    onClick: (tab: "details" | "image" | "visibility" | "monitor") => void;
}) {
    const [activeTab, setActiveTab] = useState<
        "details" | "image" | "visibility" | "monitor"
    >(tab || "details");
    const handleClick = (
        tab: "details" | "image" | "visibility" | "monitor",
    ) => {
        onClick(tab);
        setActiveTab(tab);
    };

    return (
        <div className=" z-20 mb-3 w-4/5 border-b border-gray-200">
            <ul className="-mb-px flex flex-wrap text-center text-sm font-medium text-gray-500 ">
                <li className="mr-2">
                    <a
                        href="#"
                        className={`group inline-flex rounded-t-lg p-4 ${
                            activeTab === "details"
                                ? "border-b-2 border-blue-600 text-blue-600"
                                : "border-transparent hover:border-gray-300 hover:text-gray-600"
                        }`}
                        aria-current="page"
                        onClick={() => handleClick("details")}
                    >
                        <svg
                            aria-hidden="true"
                            className={`mr-2 h-5 w-5 ${
                                activeTab === "details"
                                    ? "text-blue-600"
                                    : "text-gray-400 group-hover:text-gray-500"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                        </svg>
                        Details
                    </a>
                </li>

                <li className="mr-2">
                    <a
                        href="#"
                        className={`group inline-flex rounded-t-lg p-4 ${
                            activeTab === "image"
                                ? "border-b-2 border-blue-600 text-blue-600"
                                : "border-transparent hover:border-gray-300 hover:text-gray-600"
                        }`}
                        aria-current="page"
                        onClick={() => handleClick("image")}
                    >
                        <svg
                            aria-hidden="true"
                            className={`mr-2 h-5 w-5 ${
                                activeTab === "image"
                                    ? "text-blue-600"
                                    : "text-gray-400 group-hover:text-gray-500"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                        </svg>
                        Image
                    </a>
                </li>

                {/* <li className="mr-2">
                    <a
                        href="#"
                        className={`group inline-flex rounded-t-lg p-4 ${
                            activeTab === "environments"
                                ? "border-b-2 border-blue-600 text-blue-600"
                                : "border-transparent hover:border-gray-300 hover:text-gray-600"
                        }`}
                        aria-current="page"
                        onClick={() => handleClick("environments")}
                    >
                        <svg
                            aria-hidden="true"
                            className={`mr-2 h-5 w-5 ${
                                activeTab === "environments"
                                    ? "text-blue-600"
                                    : "text-gray-400 group-hover:text-gray-500"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                        </svg>
                        Environments
                    </a>
                </li> */}

                <li className="mr-2">
                    <a
                        href="#"
                        className={`group inline-flex rounded-t-lg p-4 ${
                            activeTab === "visibility"
                                ? "border-b-2 border-blue-600 text-blue-600 "
                                : "border-transparent hover:border-gray-300 hover:text-gray-600 "
                        }`}
                        aria-current="page"
                        onClick={() => handleClick("visibility")}
                    >
                        <svg
                            aria-hidden="true"
                            className={`mr-2 h-5 w-5 ${
                                activeTab === "visibility"
                                    ? "text-blue-600 "
                                    : "text-gray-400 group-hover:text-gray-500 "
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                        </svg>
                        Visibility
                    </a>
                </li>

                <li className="mr-2">
                    <a
                        href="#"
                        className={`group inline-flex rounded-t-lg p-4 ${
                            activeTab === "monitor"
                                ? "border-b-2 border-blue-600 text-blue-600 "
                                : "border-transparent hover:border-gray-300 hover:text-gray-600 "
                        }`}
                        onClick={() => handleClick("monitor")}
                    >
                        <svg
                            aria-hidden="true"
                            className={`mr-2 h-5 w-5 ${
                                activeTab === "monitor"
                                    ? "text-blue-600 "
                                    : "text-gray-400 group-hover:text-gray-500 "
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
                        Monitor
                    </a>
                </li>
            </ul>
        </div>
    );
}
