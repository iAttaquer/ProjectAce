"use client";
import { useUser } from "@/hooks/userContext";
import { logout } from "@/components/logout";
import { useRouter } from "next/navigation";
import { ChangePassword } from "./updates/ChangePassword";
import { ChangeNames } from "./updates/ChangeNames";

export default function Navbar(){
  const { user, loading } = useUser();
  const router = useRouter();

  return (
    <div className="p-3">
    <div className="navbar bg-base-100 bg-opacity-40 rounded-lg">
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
              <div className="flex items-center text-md">
                {loading && <div className="h-2.5 animate-pulse bg-gray-200 rounded-full dark:bg-gray-700 w-28 "></div>}
                {user ? `${user.firstName} ${user.lastName}` : null}
              </div>
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
            <li>
              <a onClick={()=>document.getElementById('profile-modal')?.showModal()}>
                Profil
              </a>
            </li>
            <li>
              <a onClick={()=>document.getElementById('settings-modal')?.showModal()}>
                Ustawienia
              </a>
            </li>
            <li><a onClick={() => {logout(router)}}>Wyloguj</a></li>
          </ul>
        </div>
      </div>
    </div>
    <dialog id="profile-modal" className="modal">
      <div className="modal-box">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <div className="mt-2 flex row gap-5">
          <div className="rounded-full w-20 h-20 flex border border-gray-400 items-center justify-center">
            <i className="fi fi-sr-user flex" style={{fontSize: '2em'}}></i>
          </div>
          <div>
            <h3 className="font-bold text-lg">{user?.firstName} {user?.lastName}</h3>
            <div className="flex row gap-1">
              <p>Username: </p>
              <h3 className="font-bold">{user?.username}</h3>
            </div>
            <div className="flex row gap-1">
              <p>Email: </p>
              <h3 className="font-bold">{user?.email}</h3>
            </div>
          </div>
        </div>
      </div>
    </dialog>
    <dialog id="settings-modal" className="modal ">
      <div className="modal-box w-fit">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <div role="tablist" className="tabs tabs-bordered bg-transparent tabs-lg">
          <input type="radio" name="my_tabs_1" role="tab" className="tab text-lg font-semibold" aria-label="Zmiana hasła" />
          <div role="tabpanel" className="tab-content p-2">
            <ChangePassword />
          </div>
          <input
            type="radio"
            name="my_tabs_1"
            role="tab"
            className="tab"
            aria-label="Zmiana imienia i nazwiska"
            defaultChecked />
          <div role="tabpanel" className="tab-content p-2">
            <ChangeNames />
          </div>
        </div>
      </div>
    </dialog>
    </div>
  );
}