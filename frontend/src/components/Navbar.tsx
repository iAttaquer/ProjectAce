"use client";
import { useUser } from "@/hooks/useUser";
import { logout } from "@/components/logout";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, loading } = useUser();
  const router = useRouter();

  return (
    <div className="navbar bg-base-200">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl -space-x-2">
          <h1 className="project-title1 text-2xl font-bold text-gray-500">Project</h1>
          <h1 className="project-title2 text-3xl font-bold text-green-500">ACE</h1>
        </a>
      </div>
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost">
            <div className="h-10 flex justify-center items-center space-x-2">
              <div className="h-10 flex rounded-full row justify-center items-center">
                <i className="fi fi-sr-user flex"></i>
              </div>
              <div className="flex items-center">
                {loading && <div className="h-2.5 animate-pulse bg-gray-200 rounded-full dark:bg-gray-700 w-28 "></div>}
                {user ? `${user.firstName} ${user.lastName}` : null}
              </div>
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li><a>Settings</a></li>
            <li><a onClick={() => {logout(router)}}>Logout</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}