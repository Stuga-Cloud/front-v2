import React, { useState } from "react";
import { AvailableContainerDetailsTabs } from "@/components/services/containers/applications/details/container-details";

export default function TabsContainerDetails({
    tab,
    onClick,
    userIsAdmin,
}: {
    tab: AvailableContainerDetailsTabs;
    onClick: (tab: AvailableContainerDetailsTabs) => void;
    userIsAdmin: () => boolean;
}) {
    const [activeTab, setActiveTab] = useState<AvailableContainerDetailsTabs>(
        tab || "preview",
    );
    const handleClick = (tab: AvailableContainerDetailsTabs) => {
        onClick(tab);
        setActiveTab(tab);
    };

    return (
        <div className="z-20 mb-3 w-4/5 border-b border-gray-200">
            <ul className="-mb-px flex flex-wrap text-center text-sm font-medium text-gray-500">
                <li className="mr-2">
                    <a
                        href="#"
                        className={`group inline-flex rounded-t-lg p-4 ${
                            activeTab === "preview"
                                ? "border-b-2 border-green-400 text-green-400"
                                : "border-transparent hover:border-gray-300 hover:text-gray-600"
                        }`}
                        aria-current="page"
                        onClick={() => handleClick("preview")}
                    >
                        Preview
                    </a>
                </li>
                <li className="mr-2">
                    <a
                        href="#"
                        className={`group inline-flex rounded-t-lg p-4 ${
                            activeTab === "status"
                                ? "border-b-2 border-green-400 text-green-400"
                                : "border-transparent hover:border-gray-300 hover:text-gray-600"
                        }`}
                        aria-current="page"
                        onClick={() => handleClick("status")}
                    >
                        Status
                    </a>
                </li>
                {userIsAdmin() && (
                    <li className="mr-2">
                        <a
                            href="#"
                            className={`group inline-flex rounded-t-lg p-4 ${
                                activeTab === "deployment"
                                    ? "border-b-2 border-green-400 text-green-400"
                                    : "border-transparent hover:border-gray-300 hover:text-gray-600"
                            }`}
                            aria-current="page"
                            onClick={() => handleClick("deployment")}
                        >
                            Deployment
                        </a>
                    </li>
                )}
                <li className="mr-2">
                    <a
                        href="#"
                        className={`group inline-flex rounded-t-lg p-4 ${
                            activeTab === "logs"
                                ? "border-b-2 border-green-400 text-green-400"
                                : "border-transparent hover:border-gray-300 hover:text-gray-600"
                        }`}
                        aria-current="page"
                        onClick={() => handleClick("logs")}
                    >
                        Logs
                    </a>
                </li>
                <li className="mr-2">
                    <a
                        href="#"
                        className={`group inline-flex rounded-t-lg p-4 ${
                            activeTab === "metrics"
                                ? "border-b-2 border-green-400 text-green-400"
                                : "border-transparent hover:border-gray-300 hover:text-gray-600"
                        }`}
                        aria-current="page"
                        onClick={() => handleClick("metrics")}
                    >
                        Metrics
                    </a>
                </li>
                {/*<li className="mr-2">*/}
                {/*    <a*/}
                {/*        href="#"*/}
                {/*        className={`group inline-flex rounded-t-lg p-4 ${*/}
                {/*            activeTab === "settings"*/}
                {/*                ? "border-b-2 border-green-400 text-green-400"*/}
                {/*                : "border-transparent hover:border-gray-300 hover:text-gray-600"*/}
                {/*        }`}*/}
                {/*        aria-current="page"*/}
                {/*        onClick={() => handleClick("settings")}*/}
                {/*    >*/}
                {/*        Settings*/}
                {/*    </a>*/}
                {/*</li>*/}
            </ul>
        </div>
    );
}
