import prisma from "@/lib/prisma";
import { Lambda } from "@prisma/client";

export const GetLambdaByNameInProject = async ({
    name,
    projectId,
}: {
    name: string;
    projectId: string;
}): Promise<Lambda | null> => {
    const lambda = await prisma.lambda.findFirst({
        where: {
            name,
            projectId,
        },
    });

    return lambda ?? null;
};