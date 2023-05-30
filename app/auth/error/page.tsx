export default async function ErrorPage() {
    return (
        <div className="z-10 w-full max-w-xl px-5 xl:px-0">
            <div className="flex h-screen flex-col items-center justify-center">
                <h1 className="text-4xl font-bold text-black">Error</h1>
                <p className="text-lg font-medium">Something went wrong</p>
            </div>
        </div>
    );
}
