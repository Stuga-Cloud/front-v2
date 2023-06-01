import { Session } from "next-auth";
import { Project } from "@/lib/models/project";

export default function ProjectGlobalSettings({
    session,
    project,
}: {
    session: Session | null;
    project: Project;
}) {
    return (
        <div className="flex w-4/5 justify-center">
            <p>je suis une pomme</p>
        </div>
    );
}
