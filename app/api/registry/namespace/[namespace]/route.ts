// https://registry-cloud.machavoine.fr/api/v2.0/projects/newp_roject_again/repositories?page_size=15&page=1
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export interface ImageInformationsHarborResponse {
    artifact_count: number;
    creation_time: string;
    id: number;
    name: string;
    project_id: number;
    pull_count: number;
    update_time: string;
}

export interface ImageInformationsResponse {
    digest: string;
    size: number;
    creationTime: string;
    name: string;
    pullCount: number;
    updateTime: string;
    tag: string;
}

export async function GET(request: Request, { params }: NextRequest) {
    const session = await getServerSession(authOptions);
    const namespaceId = params!.namespace;
    if (!session) {
        return NextResponse.json(
            {
                error: "Vous devez être connecté pour récupérer un projet.",
            },
            { status: 401 },
        );
    }

    const namespace = await prisma.registryNamespace.findFirst({
        where: {
            id: namespaceId,
        },
    });

    if (!namespace) {
        return NextResponse.json(
            {
                error: "namespace not found",
            },
            { status: 404 },
        );
    }
    try {
        const res = await fetch(
            process.env.BASE_REGISTRY_ENDPOINT +
                `/api/v2.0/projects/newp_roject_again/repositories?page_size=30&page=1`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Basic ${process.env.REGISTRY_AUTH_TOKEN}`,
                },
            },
        );

        const data: ImageInformationsHarborResponse[] = await res.json();

        const results = await Promise.all(
            data.map(async (image) => {
                const imageSplit = image.name.split("/");
                const req = await fetch(
                    process.env.BASE_REGISTRY_ENDPOINT +
                        `/api/v2.0/projects/${imageSplit[0]}/repositories/${imageSplit[1]}/artifacts?with_tag=true&with_scan_overview=false&with_label=false&with_accessory=false&page_size=30&page=1`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Basic ${process.env.REGISTRY_AUTH_TOKEN}`,
                        },
                    },
                );
                const imageInfo = await req.json();
                return {
                    digest: imageInfo[0].digest,
                    size: imageInfo[0].size,
                    creationTime: image.creation_time,
                    name: image.name,
                    pullCount: image.pull_count,
                    updateTime: image.update_time,
                };
            }),
        );

        const imageDetailsComplete = await Promise.all(
            results.map(async (result) => {
                const nameSplit = result.name.split("/");
                const req = await fetch(
                    process.env.BASE_REGISTRY_ENDPOINT +
                        `/api/v2.0/projects/${nameSplit[0]}/repositories/${nameSplit[1]}/artifacts/${result.digest}/tags?with_signature=true&with_immutable_status=true&page_size=8&page=1`,

                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Basic ${process.env.REGISTRY_AUTH_TOKEN}`,
                        },
                    },
                );
                const detailImage = await req.json();

                return {
                    ...result,
                    tag: detailImage[0].name,
                };
            }),
        );

        return NextResponse.json(
            { namespace, images: imageDetailsComplete },
            { status: 200 },
        );
    } catch (error) {
        return NextResponse.json(
            {
                error: "internal server error",
            },
            { status: 500 },
        );
    }
}
