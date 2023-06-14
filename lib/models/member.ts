import { ProjectMembershipRole } from "@/lib/models/project";

export interface Member {
    id: string;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    image: string | null;
    role: ProjectMembershipRole;
}
