import { Member } from "@/lib/models/member";
import { Project } from "@/lib/models/project";

const userRoleInProject = (
    userId: string,
    members: Member[],
    projectId: string,
) => {
    const foundMember = members.find((member) => member.id === userId);
    if (!foundMember) {
        console.log(`User ${userId} is not a member of project ${projectId}`);
        return null;
    }
    return foundMember.role;
};

export const getUserBadge = (
    members: Member[],
    member: Member,
    project: Project,
) => {
    if (project.createdBy === member.id) {
        return (
            <span className="inline-flex rounded-full bg-green-100 px-2 text-center text-xs font-semibold leading-5 text-green-800">
                Creator 💮
            </span>
        );
    } else if (userRoleInProject(member.id, members, project.id) === "ADMIN") {
        return (
            <span className="inline-flex rounded-full bg-yellow-100 px-2 text-center text-xs font-semibold leading-5 text-yellow-800">
                Admin 🛡️
            </span>
        );
    } else {
        return (
            <span className="inline-flex rounded-full bg-blue-100 px-2 text-center text-xs font-semibold leading-5 text-blue-800">
                Collaborator 🤝
            </span>
        );
    }
};
