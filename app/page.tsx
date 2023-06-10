import UnAuthentified from "@/components/home/un-authentified";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Authentified from "@/components/home/authentified";

export default async function Home() {
    const session = await getServerSession(authOptions);

    return (
        <>{session ? <Authentified session={session} /> : <UnAuthentified />}</>
    );
}
