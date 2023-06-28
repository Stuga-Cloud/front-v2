export default function ServicePopUpCard({
    title,
    description,
    color,
    onClick,
}: {
    title: string;
    description: string;
    color: 'blue' | 'green' | 'purple' | 'red';
    onClick: () => void;
}) {
    const getColorClass = (color: 'blue' | 'green' | 'purple' | 'red') => {
        switch(color) {
            case 'green':
                return 'bg-green-400 hover:bg-green-500';
            case 'red':
                return 'bg-red-400 hover:bg-red-500';
            case 'purple':
                return 'bg-purple-400 hover:bg-purple-500';
            case 'blue':
                return 'bg-blue-500 hover:bg-blue-600';
            default:
                return 'bg-gray-200';
        }
    };
    return (
        <div
            className={`min-h-[10rem] min-w-[15rem] transform cursor-pointer rounded-lg p-4 shadow-lg transition-transform duration-500 hover:scale-105 active:scale-95 ${getColorClass(color)}`}
            onClick={onClick}
        >
            <div className="rounded-lg bg-blue-500"></div>
            <div className="flex-1 p-4">
                <h2 className="mb-2 text-lg font-bold">{title}</h2>
                <p>{description}</p>
            </div>
        </div>
    );
}
