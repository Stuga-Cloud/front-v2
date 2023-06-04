import { useEffect, useRef, useState } from "react";

export const DropdownAction = () => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    const handleButtonClick = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative inline-block text-left" ref={ref}>
            <div>
                <button
                    type="button"
                    className="inline-flex w-full text-blue-700 justify-center gap-x-1.5 rounded-md bg-transparent px-3 py-2 text-sm font-semibold ring-inset ring-gray-300 border-none"
                    id="menu-button"
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    onClick={handleButtonClick}
                >
                    Actions
                </button>
            </div>{" "}
            {isOpen && (
                <div
                    className="bg-white hover:bg-gray-100 absolute right-0 z-20 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="menu-button"
                    tabIndex={-1}
                >
                    <div className="py-1" role="none">
                        <a
                            href="#"
                            className="block px-4 py-2 text-sm text-red-700"
                            role="menuitem"
                            tabIndex={-1}
                            id="menu-item-0"
                        >
                            delete
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};
