export default function ServicePopUpCard({
    title,
    onClick,
}: {
    title: string;
    onClick: () => void;
}) {
    return (
        <div
            className="min-h-[10rem] min-w-[15rem] transform cursor-pointer rounded-lg bg-gray-200 p-4 shadow-lg transition-transform duration-500 hover:scale-105 active:scale-95"
            onClick={onClick}
        >
            <div className="rounded-lg bg-blue-500"></div>
            <div className="flex-1 p-4">
                <h2 className="mb-2 text-lg font-bold">{title}</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
        </div>
    );
}
