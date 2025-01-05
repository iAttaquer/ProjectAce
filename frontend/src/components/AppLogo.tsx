"use client";
import Link from 'next/link';

export function AppLogo() {
  return (
    <Link href="/">
      <button className="btn btn-ghost flex flex-row justify-center items-center mb-5 hover:bg-transparent -space-x-2">
        <h1 className="project-title1 text-2xl font-bold text-gray-500">Project</h1>
        <h1 className="project-title2 text-3xl font-bold text-green-500">ACE</h1>
      </button>
    </Link>
  );
}