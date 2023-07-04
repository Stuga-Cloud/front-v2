import { useEffect, useRef, useState } from "react";
import ConfirmDeleteContainerNamespaceModal from "@/components/services/containers/informations/modal-delete-container-namespace-confirm";

export const ContainerNamespaceDropdownAction = ({
    deleteAction,
    messagePopup,
}: {
    deleteAction: () => void;
    messagePopup: string;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
    const ref = useRef<any>(null);

    const handleButtonClick = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative inline-block text-left" ref={ref}>
            <div>
                <button
                    type="button"
                    className="inline-flex w-full justify-center gap-x-1.5 rounded-md border-none bg-transparent px-3 py-2 text-sm font-semibold text-blue-700 ring-inset ring-gray-300"
                    id="menu-button"
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    onClick={() => {
                        setIsOpenDeleteModal(true);
                    }}
                >
                    <div className="py-1" role="none">
                        <a
                            href="#"
                            className="block px-4 py-2 text-sm text-red-700 hover:bg-red-100"
                            role="menuitem"
                            tabIndex={-1}
                            id="menu-item-0"
                        >
                            Delete
                        </a>
                    </div>
                </button>
            </div>{" "}
            {/* {isOpen && (
                <div
                    className="absolute right-0 z-20 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 hover:bg-gray-100 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="menu-button"
                    tabIndex={-1}
                    onClick={() => {
                        setIsOpenDeleteModal(true);
                        handleButtonClick();
                    }}
                >
                    <div className="py-1" role="none">
                        <a
                            href="#"
                            className="block px-4 py-2 text-sm text-red-700"
                            role="menuitem"
                            tabIndex={-1}
                            id="menu-item-0"
                        >
                            Delete
                        </a>
                    </div>
                </div>
            )} */}
            <ConfirmDeleteContainerNamespaceModal
                text={messagePopup}
                onClose={() => setIsOpenDeleteModal(false)}
                isOpenFromParent={isOpenDeleteModal}
                deleteAction={() => {
                    deleteAction();
                    setIsOpenDeleteModal(false);
                }}
            />
        </div>
    );
};
