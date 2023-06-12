import UnAuthentified from "@/components/home/un-authentified";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Authentified from "@/components/home/authentified";
import { Suspense } from "react";
import Nav from "@/components/layout/nav";

export default async function Home() {
    const session = await getServerSession(authOptions);

    return (
        <>
            <Suspense fallback="...">
                <Nav session={session} breadcrumbItems={[]} />
            </Suspense>
            {session ? (
                <>
                    <div className="z-10 flex flex w-full flex-col">
                        <Authentified session={session} />
                    </div>
                </>
            ) : (
                <>
                    <UnAuthentified />
                </>
            )}
        </>
    );
}
