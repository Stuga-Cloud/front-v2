import { useState } from "react";

export const DropdownAction = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleButtonClick = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative inline-block text-left">
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
                    {/* <svg
                        className="-mr-1 h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                            clipRule="evenodd"
                        />
                    </svg> */}
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
                // <a
                //     href="#"
                //     className="block px-4 py-2 text-sm text-gray-700"
                //     role="menuitem"
                //     tabIndex={-1}
                //     id="menu-item-1"
                // >
                //     Support
                // </a>
                // <a
                //     href="#"
                //     className="block px-4 py-2 text-sm text-gray-700"
                //     role="menuitem"
                //     tabIndex={-1}
                //     id="menu-item-2"
                // >
                //     License
                // </a>
                // <div className="py-1" role="none">
                //     <form method="POST" action="#" role="none">
                //         <button
                //             type="submit"
                //             className="block w-full px-4 py-2 text-left text-sm text-gray-700"
                //             role="menuitem"
                //             tabIndex={-1}
                //             id="menu-item-3"
                //         >
                //             Sign out
                //         </button>
                //     </form>
                // </div>
            )}
        </div>
    );
};
