"use client";
import { useState } from "react";
import TabsNamespace from "./tabs-namespace"
import Dashboard from "./dashboard";
import Settings from "./settings";

export default function Namespaces() {

    const [activeTab, setActiveTab] = useState<"dashboard" | "settings">("dashboard");
    
    return (
        <div className="z-10 w-full flex flex-col justify-center items-center">
            <h2 className="w-4/5 text-4xl font-bold mb-5">Container Registry</h2>
            <TabsNamespace onClick={ (tab: "settings" | "dashboard") => {
                setActiveTab(tab)
            }}/>
            {activeTab === "dashboard" ? (
                <Dashboard />
            ) : (
                <Settings />
            )}
        </div>
    );
}
