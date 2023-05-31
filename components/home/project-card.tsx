import Balancer from "react-wrap-balancer";

export default function ProjectCard({
    name,
    onClick,
}: {
    name: string;
    onClick: () => void;
}) {
    return (
        <div
            className="relative col-span-1 h-60 cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition-shadow duration-300 ease-in-out hover:shadow-lg"
            onClick={onClick}
        >
            <div className="mx-auto max-w-md text-start">
                <h2 className="bg-gradient-to-br from-black to-stone-500 bg-clip-text p-5 font-display text-xl font-bold text-transparent md:text-2xl md:font-normal">
                    <Balancer>{name}</Balancer>
                </h2>
            </div>
        </div>
    );
}
