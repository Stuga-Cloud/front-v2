import React, { useState } from "react";
import { AvailableContainersInfoTab } from "@/components/services/containers/informations/containers-info";

export default function TabsContainersInfo({
    tab,
    onClick,
}: {
    tab: AvailableContainersInfoTab;
    onClick: (tab: AvailableContainersInfoTab) => void;
}) {
    const [activeTab, setActiveTab] = useState<AvailableContainersInfoTab>(
        tab || "namespaces",
    );
    const handleClick = (tab: AvailableContainersInfoTab) => {
        onClick(tab);
        setActiveTab(tab);
    };

    return (
        <div className=" z-20 mb-3 w-4/5 border-b border-gray-200">
            <ul className="-mb-px flex flex-wrap text-center text-sm font-medium text-gray-500">
                <li className="mr-2">
                    <a
                        href="#"
                        className={`group inline-flex rounded-t-lg p-4 ${
                            activeTab === "namespaces"
                                ? "border-b-2 border-green-400 text-green-400"
                                : "border-transparent hover:border-gray-300 hover:text-gray-600"
                        }`}
                        aria-current="page"
                        onClick={() => handleClick("namespaces")}
                    >
                        <svg
                            aria-hidden="true"
                            className={`mr-2 h-5 w-5 ${
                                activeTab === "namespaces"
                                    ? "border-b-2 border-green-400 text-green-400"
                                    : "text-gray-400 group-hover:text-gray-500"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                        </svg>
                        Namespaces
                    </a>
                </li>
                <li className="mr-2">
                    <a
                        href="#"
                        className={`group inline-flex rounded-t-lg p-4 ${
                            activeTab === "documentation"
                                ? "border-b-2 border-green-400 text-green-400"
                                : "border-transparent hover:border-gray-300 hover:text-gray-600"
                        }`}
                        aria-current="page"
                        onClick={() => handleClick("documentation")}
                    >
                        <svg
                            aria-hidden="true"
                            className={`mr-2 h-5 w-5 ${
                                activeTab === "documentation"
                                    ? "border-b-2 border-green-400 text-green-400"
                                    : "text-gray-400 group-hover:text-gray-500"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                        </svg>
                        Documentation
                    </a>
                </li>
            </ul>
        </div>
    );
}
