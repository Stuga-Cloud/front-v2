import { useState } from "react";
import { ProjectSettingsPages } from "./project-settings-tab";

export default function ProjectSettingsTabs({
    onClick,
}: {
    onClick: (tab: ProjectSettingsPages) => void;
}) {
    const [activeTab, setActiveTab] = useState<ProjectSettingsPages>("global");
    const handleClick = (tab: ProjectSettingsPages) => {
        onClick(tab);
        setActiveTab(tab);
    };

    return (
        <div className="mb-3 w-4/5 border-b border-gray-200">
            <ul className="-mb-px flex flex-wrap text-center text-sm font-medium text-gray-500">
                <li className="mr-2">
                    <a
                        href="#"
                        className={`group inline-flex rounded-t-lg p-4 ${
                            activeTab === "global"
                                ? "border-b-2 border-green-500 text-green-500"
                                : "border-transparent hover:border-gray-300 hover:text-gray-600"
                        }`}
                        aria-current="page"
                        onClick={() => handleClick("global")}
                    >
                        <svg
                            aria-hidden="true"
                            className={`mr-2 h-5 w-5 ${
                                activeTab === "global"
                                    ? "text-green-500"
                                    : "text-gray-400 group-hover:text-gray-500"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"></path>
                        </svg>
                        Global
                    </a>
                </li>
                <li className="mr-2">
                    <a
                        href="#"
                        className={`group inline-flex rounded-t-lg p-4 ${
                            activeTab === "members"
                                ? "border-b-2 border-green-500 text-green-500"
                                : "border-transparent hover:border-gray-300 hover:text-gray-600"
                        }`}
                        onClick={() => handleClick("members")}
                    >
                        <svg
                            aria-hidden="true"
                            className={`mr-2 h-5 w-5 ${
                                activeTab === "members"
                                    ? "text-green-500"
                                    : "text-gray-400 group-hover:text-gray-500"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"></path>
                        </svg>
                        Members
                    </a>
                </li>
            </ul>
        </div>
    );
}
