"use client";

import { useState } from "react";

export function EditableText({
    text,
    onSave,
}: {
    text: string;
    onSave: (newValue: string) => void;
}) {
    const [value, setValue] = useState(text);

    return (
        <section>
            <div className="flex flex-row gap-2">
                <textarea
                    className="w-4/6 rounded-md border border-gray-300 p-2"
                    onChange={(e) => {
                        setValue(e.target.value);
                    }}
                    autoFocus
                    value={value}
                    placeholder="Add a description"
                />
            </div>
            {/* Save and cancel buttons */}
            <div className="mt-2 flex flex-row gap-2">
                <button
                    className="Button stuga-primary-color mt-2"
                    onClick={() => {
                        onSave(value);
                    }}
                >
                    Save
                </button>
                <button
                    className="Button stuga-red-color mt-2"
                    onClick={() => {
                        setValue(text);
                    }}
                >
                    Cancel
                </button>
            </div>
        </section>
    );
}
