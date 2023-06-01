import { Member } from "@/lib/models/member";

export interface Project {
    id: string;
    name: string;
    members: Member[];
    createdBy: string;
}
