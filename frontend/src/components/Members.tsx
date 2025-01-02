"use client";
import { useProject } from "@/hooks/projectContext";
import { useUser } from "@/hooks/userContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { DeleteMember } from "./deletes/DeleteMember";

export type UserDto = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
}

export default function Members() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTerm2, setSearchTerm2] = useState('');
  const { project, members, fetchMembers } = useProject();
  const { user } = useUser();
  const [users, setUsers] = useState<UserDto[]>([]);
  const router = useRouter();
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredMembers = members.filter(member =>
    member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => a.username.localeCompare(b.username));

  const handleSearchChangeUser = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm2(event.target.value);
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm2.toLowerCase()) ||
    user.firstName.toLowerCase().includes(searchTerm2.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm2.toLowerCase())
  ).sort((a, b) => a.username.localeCompare(b.username));

  const fetchUsers = useCallback(async () => {
    if (!project) {
      setUsers([]);
      return;
    }
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.replace('/login');
        return;
      }
      const response = await axios.get(`/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    }
    catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const status = error.response.status;

          if (status === 401) {
            localStorage.removeItem('authToken');
            router.replace('/login');
          }
          }
      }
    }
  },[project]);

  useEffect(() => {
    fetchUsers();
  },[fetchUsers]);

  const addMember = async(userId: string) => {
    if (!project) {
      return;
    }
    const token = localStorage.getItem('authToken');
      if (!token) {
        router.replace('/login');
        return;
      }
    console.log('tutaj');
    try {
      const response = await axios.post(`api/project-teams/${project?.id}/${userId}`, {}, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      },);
      console.log(response);
      fetchMembers();
      fetchUsers();
    }
    catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const status = error.response.status;
          console.log(error);

          if (status === 401) {
            localStorage.removeItem('authToken');
            router.replace('/login');
            return;
          }
          toast.error('Błąd!', { position: "bottom-center"});
        }
      }
    }
  }

  const handleCloseDeleteModal = () => {
    document.getElementById('delete-task-modal')?.close();
  }

  return (
    <div className="w-1/3 flex flex-col pl-3">
      <div className="flex flex-row space-x-2">
        <form className="flex-grow">
          <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input type="search" id="default-search" className="block w-full p-3 ps-9 text-sm text-gray-100 shadow-xl rounded-lg focus:ring-green-500 focus:border-green-500  bg-base-100 bg-opacity-50"
              placeholder="Wyszukaj członka"
              value={searchTerm}
              onChange={handleSearchChange}
              required />
          </div>
        </form>
        <button className="btn btn-square bg-gradient-to-r text-white from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80"
          onClick={()=>document.getElementById('add-member-modal')?.showModal()}>
          <i className="fi fi-br-plus"></i>
        </button>
      </div>
      <div className="h-screen-minus-10.5rem pt-1 space-y-2 overflow-y-auto">
        {members && filteredMembers.map((member) => (
          (project?.createdBy !== user?.username || member.username === user?.username) ?
          <div key={member.id} className="card card-compact flex flex-row items-center space-x-2 w-full h-fit px-3 pt-2 pb-3 space-y-1 bg-base-100 bg-opacity-40 shadow-xl rounded-lg relative group">
            <div className="w-8 h-8 flex rounded-full row justify-center items-center border border-gray-400">
              <i className="fi fi-sr-user flex"></i>
            </div>
            <div className="flex flex-col">
              <p>{member.firstName} {member.lastName}</p>
              <span className="w-fit bg-gray-100 text-gray-800 text-xs font-medium px-1.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">{member.username}</span>
            </div>
          </div>
          :
          <div key={member.id} className="card card-compact flex flex-row items-center space-x-2 w-full h-fit px-3 pt-2 pb-3 space-y-1 bg-base-100 bg-opacity-40 shadow-xl rounded-lg relative group">
            <div className="w-8 h-8 flex rounded-full row justify-center items-center border border-gray-400">
              <i className="fi fi-sr-user flex"></i>
            </div>
            <div className="flex flex-col">
              <p>{member.firstName} {member.lastName}</p>
              <span className="w-fit bg-gray-100 text-gray-800 text-xs font-medium px-1.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">{member.username}</span>
            </div>
            <div className="absolute right-2 top-3 space-x-1">
              <button className="btn btn-circle btn-sm btn-ghost opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedUserId(member.id);
                  document.getElementById('delete-task-modal')?.showModal();
                }}>
                <i className="fi fi-rs-user-minus"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
      <dialog id="add-member-modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <div className="flex items-center justify-between p-2 border-b rounded-t dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Dodaj nowego członka do projektu
            </h3>
          </div>
          <form className="flex-grow">
          <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input type="search" id="default-search" className="block w-full p-3 ps-9 mt-2 text-sm text-gray-100 shadow-xl rounded-lg focus:ring-green-500 focus:border-green-500  bg-gray-700 bg-opacity-50"
              placeholder="Wyszukaj użytkownika"
              value={searchTerm2}
              onChange={handleSearchChangeUser}
              required />
          </div>
          </form>
          {filteredUsers.map((user)=>(
            members.find(m => m.username === user.username) ? null : (
            <div key={user.id} className="card card-compact flex flex-row items-center space-x-2 w-full h-fit px-3 pt-2 pb-3 space-y-1 bg-base-100 bg-opacity-40 shadow-xl rounded-lg relative group">
              <div className="w-8 h-8 flex rounded-full row justify-center items-center border border-gray-400">
                <i className="fi fi-sr-user flex"></i>
              </div>
              <div className="flex flex-col">
                <p>{user.firstName} {user.lastName}</p>
                <span className="w-fit bg-gray-100 text-gray-800 text-xs font-medium px-1.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">{user.username}</span>
              </div>
              <div className="absolute right-2 top-4 space-x-1">
                <button className="btn btn-circle btn-sm btn-ghost opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100"
                  onClick={() => {
                    addMember(user.id);
                  }}>
                  <i className="fi fi-rs-user-add"></i>
                </button>
              </div>
            </div>
            )
          ))}
        </div>
      </dialog>
      <dialog id="delete-task-modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
        <DeleteMember projectId={project?.id} memberId={selectedUserId} onMemberDeleted={fetchMembers} onClose={handleCloseDeleteModal}/>
        </div>
      </dialog>
    </div>
  )
}