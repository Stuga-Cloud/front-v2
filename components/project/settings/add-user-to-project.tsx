import {
    Close,
    Description,
    Dialog,
    DialogContent,
    DialogTrigger,
    Overlay,
    Portal,
    Title,
} from "@radix-ui/react-dialog";

import axios from "axios";
import { useState } from "react";
import { Project, ProjectMembershipRole } from "@/lib/models/project";
import { Cross2Icon } from "@radix-ui/react-icons";
import LoadingDots from "@/components/shared/icons/loading-dots";
import { DisplayToast } from "@/components/shared/toast/display-toast";

export default function AddUserToProject({
    project,
    afterAddedMember,
}: {
    project: Project;
    afterAddedMember: () => void;
}) {
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<ProjectMembershipRole>("MEMBER");
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post("/api/projects/users", {
                email,
                projectId: project.id,
                role,
            });
            setEmail("");
            setLoading(false);
            setOpen(false);
            await afterAddedMember();
        } catch (error: any) {
            setLoading(false);
            console.error(error);
            if (error.response.status === 409) {
                DisplayToast({
                    type: "error",
                    message: "This user is already a member of this project.",
                });
                return;
            }
            if (error.response.status === 404) {
                DisplayToast({
                    type: "error",
                    message: "This user does not exist.",
                });
                return;
            }

            DisplayToast({
                type: "error",
                message: "An error occurred while adding the user.",
            });
        }
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button type="button" className="Button stuga-primary-color">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 4v16m8-8H4"
                        ></path>
                    </svg>
                    New member
                </button>
            </DialogTrigger>
            <Portal className="z-20">
                <Overlay className="DialogOverlay" />
                <DialogContent className="DialogContent z-10">
                    <Title className="DialogTitle">New member</Title>
                    <Description className="DialogDescription">
                        Add a new member to the project
                    </Description>
                    <fieldset className="Fieldset">
                        <label className="Label" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="Input"
                            id="email"
                            placeholder={"john.doe@example.com"}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </fieldset>
                    <fieldset className="Fieldset">
                        <label className="Label" htmlFor="role">
                            Role
                        </label>
                        <select
                            className="Input"
                            id="role"
                            onChange={(e) =>
                                setRole(e.target.value as ProjectMembershipRole)
                            }
                        >
                            <option value="MEMBER">Member</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </fieldset>
                    <div
                        style={{
                            display: "flex",
                            marginTop: 25,
                            justifyContent: "flex-end",
                        }}
                    >
                        <button
                            className="Button stuga-primary-color"
                            onClick={(e) => handleSubmit(e)}
                        >
                            {loading ? (
                                <LoadingDots color="#808080" />
                            ) : (
                                "Add member"
                            )}
                        </button>
                    </div>
                    <Close asChild>
                        <button
                            type="submit"
                            className="IconButton"
                            aria-label="Close"
                        >
                            <Cross2Icon />
                        </button>
                    </Close>
                </DialogContent>
            </Portal>
        </Dialog>
    );
}
