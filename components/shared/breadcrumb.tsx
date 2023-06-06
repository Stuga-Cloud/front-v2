"use client";
import React from 'react';

export interface BreadcrumbItem {
  text: string,
  slug: string,
}

function createUrl(slug: string) {
  return location.protocol + '//' + location.host + slug;
}

export const Breadcrumb = ({ items }: { items: BreadcrumbItem[] }) => {
  const localUrl = location.protocol + '//' + location.host;
  return (
    <nav className="fixed z-50 top-2 left-1/2 transform -translate-x-1/2 flex px-5 py-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-50" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <a href={localUrl} className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
            <svg aria-hidden="true" className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
            </svg>
            Home
          </a>
        </li>

    {items.map((item, index) => (
        <li aria-current="page" key={index}>
          <div className="flex items-center">
            <a href={createUrl(item.slug)} className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
              <svg aria-hidden="true" className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">{item.text}</span>
            </a>
          </div>
        </li>
    ))}
      </ol>
    </nav>
  );
};
