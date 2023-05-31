export default async function LambdaNewPage({
    searchParams,
}: {
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    return (
        <>
            <div className="z-20">Create Lambda</div>
        </>
    );
}
