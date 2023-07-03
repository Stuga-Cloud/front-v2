import { Project } from "@prisma/client";
import axios from "axios";

export const GetProject = async (projectId: string): Promise<Project> => {
    try {
        const res = await axios<Project>(`/api/projects/${projectId}`);
        return res.data;
    } catch (error) {
        throw error;
    }
};