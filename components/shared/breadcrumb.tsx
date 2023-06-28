"use client";
import Link from "next/link";
import React from "react";
import Image from "next/image";

export interface BreadcrumbItem {
    text: string;
    slug: string;
}

function createUrl(slug: string) {
    let domain = process.env.NEXT_PUBLIC_DOMAIN!

    return `${domain}/${slug}`
}

export const Breadcrumb = ({ items }: { items: BreadcrumbItem[] }) => {
    let domain = process.env.NEXT_PUBLIC_DOMAIN!
    return (
        <nav
            className="fixed left-2 top-2 z-20 flex rounded-lg border border-gray-200 bg-gray-50 px-5 py-3 text-gray-700"
            aria-label="Breadcrumb"
        >
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                    <Link
                        href={domain}
                        className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
                    >
                        <Image
                            src="/stuga-logo.png"
                            alt="stuga logo"
                            width="30"
                            height="30"
                            className="mr-2 rounded-sm"
                        />
                        Home
                    </Link>
                </li>

                {items.map((item, index) => (
                    <li aria-current="page" key={index}>
                        <div className="flex items-center">
                            <Link
                                href={createUrl(item.slug)}
                                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
                            >
                                <svg
                                    aria-hidden="true"
                                    className="h-6 w-6 text-gray-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                        clipRule="evenodd"
                                    ></path>
                                </svg>
                                <span className="ml-1 text-sm font-medium text-gray-500 hover:text-blue-600 md:ml-2">
                                    {item.text}
                                </span>
                            </Link>
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    );
};
