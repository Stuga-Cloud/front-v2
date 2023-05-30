import WebVitals from "@/components/home/web-vitals";
import Image from "next/image";
import UnAuthentified from "@/components/home/un-authentified";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Authentified from "@/components/home/authentified";

export default async function Home({
    searchParams,
}: {
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    console.log(searchParams!.error);
    const session = await getServerSession(authOptions);

    return (
        <>{session ? <Authentified session={session} /> : <UnAuthentified />}</>
    );
}
