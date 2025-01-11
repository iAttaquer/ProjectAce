"use client";
import { AssignmentDto, useProject } from "@/hooks/projectContext";
import { useCallback, useEffect, useState } from "react";
import { CreateTask } from "./creates/CreateTask";
import axios from "axios";
import router from "next/router";
import toast from "react-hot-toast";
import { DeleteTask } from "./deletes/DeleteTask";
import { ChangeTask } from "./updates/ChangeTask";
import Badge from "./Badge";
import Members, { UserDto } from "./Members";

export default function ProjectDetails() {
  const { project, tasks, members, loading, fetchTasks } = useProject();
  const [selectedTask, setSelectedTask] = useState<AssignmentDto | null>(null);
  const [sortedTasks, setSortedTasks] = useState<AssignmentDto[]>([]);
  const [assignments, setAssignments] = useState<UserDto[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCheckboxChange =  async (e, task: AssignmentDto) => {
    e.stopPropagation();
    let status;
    if (task.status === "Wykonane") {
      status = "Niewykonane";
    } else {
      status = "Wykonane";
    }
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.replace('/login');
        return;
      }
      await axios.put(`api/assignments/${task.id}`, {
        name: task.name, description: task.description, status
      }, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      },);
      fetchTasks();
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

  useEffect(() => {
    const sortedTasks = tasks.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
    setSortedTasks(sortedTasks);
  }, [tasks]);

  const handleCloseChangeModal = () => {
    document.getElementById('change-task-modal')?.close();
  };

  const handleCloseDeleteModal = () => {
    document.getElementById('delete-task-modal')?.close();
  };

  const fetchAssignments = async() => {
    if (!selectedTask) {
      setAssignments([]);
      return;
    }
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.replace('/login');
        return;
      }
      const response = await axios.get(`api/assignment-users/${selectedTask?.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssignments(response.data);
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
  };

  useEffect(() => {
    fetchAssignments();
  }, [selectedTask]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredMembers = members.filter(member =>
    member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => a.username.localeCompare(b.username));

  const addAssignment = async(userId: string) => {
    if (!selectedTask) {
      return;
    }
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.replace('/login');
      return;
    }
    try {
      await axios.post(`api/assignment-users/${selectedTask?.id}/${userId}`, {}, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      },);
      fetchAssignments();
    }
    catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const status = error.response.status;
          // console.log(error);

          if (status === 401) {
            localStorage.removeItem('authToken');
            router.replace('/login');
            return;
          }
          toast.error('Błąd!', { position: "bottom-center"});
        }
      }
    }
  };

  const removeAssignment = async(userId: string) => {
    if (!selectedTask) {
      return;
    }
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.replace('/login');
      return;
    }
    try {
      await axios.delete(`api/assignment-users/${selectedTask.id}/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      },);
      fetchAssignments();
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
  };

  return(
    <div className="w-4/5 mr-3 ml-2 mb-3 flex flex-col">
      {project ? (
        <>
         <div className="card card-compact flex flex-row font-semibold text-xl w-full h-fit px-3 pt-2 pb-3 bg-base-100 bg-opacity-40 shadow-xl mb-4 rounded-lg">
            <h1>{project.name}</h1>
            <div className="absolute right-2 top-2 space-x-1">
              <button className="btn btn-sm bg-gradient-to-r text-white from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80"
                onClick={()=>document.getElementById('create-task-modal')?.showModal()}>
                <i className="fi fi-br-plus"></i>
                Dodaj zadanie
              </button>
              <button className="btn btn-circle btn-sm btn-ghost"
                onClick={()=>document.getElementById('project-details-modal')?.showModal()}>
                <i className="fi fi-br-info"></i>
              </button>
            </div>
          </div>
          <div className="flex flex-row">
            <div className="w-full h-screen-minus-10.5rem overflow-y-auto">
              {sortedTasks.map((task) => (
                <div key={task.id} className="card card-compact flex flex-row items-center space-x-2 font-semibold text-xl w-full h-fit px-3 pt-2 pb-3  hover:bg-base-100 hover:bg-opacity-40 hover:shadow-xl rounded-lg relative group"
                  onClick={()=>{setSelectedTask(task);document.getElementById('task-details-modal')?.showModal()}}>
                  <input type="checkbox"
                    checked={task.status === "Wykonane"} readOnly
                    className="checkbox checkbox-success checkbox-sm"
                    onClick={(e)=>handleCheckboxChange(e, task)}/>
                  <h3>{task.name}</h3>
                  <div className="absolute right-2 top-2 space-x-1">
                    <button className="btn btn-circle btn-sm btn-ghost opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTask(task);
                        document.getElementById('change-assignments-modal')?.showModal();
                      }}>
                      <i className="fi fi-ss-assign"></i>
                    </button>
                    <button className="btn btn-circle btn-sm btn-ghost opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTask(task);
                        document.getElementById('change-task-modal')?.showModal();
                      }}>
                      <i className="fi fi-rr-pencil"></i>
                    </button>
                    <button className="btn btn-circle btn-sm btn-ghost opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTask(task);
                        document.getElementById('delete-task-modal')?.showModal();
                      }}>
                      <i className="fi fi-rs-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <Members />
          </div>
          <dialog id="project-details-modal" className="modal">
            <div className="modal-box">
              <p className="font-bold text-xl mb-4">{project.name}</p>
              <Badge status={project.status}/>
              <p className="py-2">{project.description}</p>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
          {selectedTask && (
          <dialog id="task-details-modal" className="modal">
            <div className="modal-box">
              <p className="font-bold text-xl mb-4">{selectedTask.name}</p>
                <Badge status={selectedTask.status}/>
              <p className="text-sm py-2">{selectedTask.description}</p>
              {assignments.length > 0 && (
              <>
              <p className="font-semibold">Przypisania:</p>
              {assignments.map((user) => (
                <div key={user.id} className="flex flex-row items-center space-x-2 w-full h-fit space-y-1 relative group">
                  <div className="w-8 h-8 flex rounded-full row justify-center items-center border border-gray-400">
                    <i className="fi fi-sr-user flex"></i>
                  </div>
                  <div className="flex flex-col">
                    <p>{user.firstName} {user.lastName}</p>
                    <span className="w-fit bg-gray-100 text-gray-800 text-xs font-medium px-1.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">{user.username}</span>
                  </div>
                </div>
              ))}
              </>
              )}
            </div>
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
          )}
          <dialog id="create-task-modal" className="modal">
            <div className="modal-box">
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
              </form>
              <div className="flex items-center justify-between p-2 border-b rounded-t dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Dodaj nowe zadanie
                </h3>
              </div>
              <CreateTask onTaskCreated={fetchTasks}/>
            </div>
          </dialog>
          <dialog id="change-task-modal" className="modal">
            <div className="modal-box">
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
              </form>
              <div className="flex items-center justify-between p-2 border-b rounded-t dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Edytuj zadanie
                </h3>
              </div>
              {selectedTask && (
                <ChangeTask task={selectedTask} onTaskUpdated={fetchTasks} onClose={handleCloseChangeModal}/>
              )}
            </div>
          </dialog>
          <dialog id="delete-task-modal" className="modal">
            <div className="modal-box">
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
              </form>
              <DeleteTask taskId={selectedTask?.id} onTaskDeleted={fetchTasks} onClose={handleCloseDeleteModal}/>
            </div>
          </dialog>
          <dialog id="change-assignments-modal" className="modal">
              <div className="modal-box">
                <form method="dialog">
                  <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <div className="flex items-center justify-between p-2 border-b rounded-t dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Zmień przypisanie do zadania
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
                  placeholder="Wyszukaj członka"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  required />
              </div>
              </form>
              <div className="h-[22rem] overflow-y-auto">
                {filteredMembers.map((user)=>(
                  assignments.find(m => m.username === user.username) ? (
                  <div key={user.id} className="card card-compact flex flex-row items-center space-x-2 w-full h-fit px-3 pt-2 pb-3 space-y-1 bg-base-100 bg-opacity-40 hover:shadow-xl hover:bg-gray-800 hover:bg-opacity-30 rounded-lg relative group">
                    <div className="w-8 h-8 flex rounded-full row justify-center items-center border border-gray-400">
                      <i className="fi fi-sr-user flex"></i>
                    </div>
                    <div className="flex flex-col">
                      <p>{user.firstName} {user.lastName}</p>
                      <span className="w-fit bg-gray-100 text-gray-800 text-xs font-medium px-1.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">{user.username}</span>
                    </div>
                    <div className="absolute right-2 top-4 space-x-1">
                      <button className="btn btn-circle btn-sm btn-ghost btn-active"
                        disabled={loading}
                        onClick={() => {
                          removeAssignment(user.id);
                        }}>
                        {loading ? (
                          <>
                            <span className="loading loading-spinner"></span>
                          </>
                        ) : (
                          <i className="fi fi-rr-minus"></i>
                        )}
                      </button>
                    </div>
                  </div>
                  ) : (
                  <div key={user.id} className="card card-compact flex flex-row items-center space-x-2 w-full h-fit px-3 pt-2 pb-3 space-y-1 bg-base-100 bg-opacity-40 hover:shadow-xl hover:bg-gray-800 hover:bg-opacity-30 rounded-lg relative group">
                    <div className="w-8 h-8 flex rounded-full row justify-center items-center border border-gray-400">
                      <i className="fi fi-sr-user flex"></i>
                    </div>
                    <div className="flex flex-col">
                      <p>{user.firstName} {user.lastName}</p>
                      <span className="w-fit bg-gray-100 text-gray-800 text-xs font-medium px-1.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">{user.username}</span>
                    </div>
                    <div className="absolute right-2 top-4 space-x-1">
                      <button className="btn btn-circle btn-sm btn-ghost btn-active"
                        disabled={loading}
                        onClick={() => {
                          addAssignment(user.id);
                        }}>
                        {loading ? (
                          <>
                            <span className="loading loading-spinner"></span>
                          </>
                        ) : (
                          <i className="fi fi-rr-plus"></i>
                        )}
                      </button>
                    </div>
                  </div>
                  )
                ))}
              </div>
              </div>
          </dialog>
        </>
      ) : (
        <div></div>
      )}
    </div>
  );
};