"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import router from "next/router";
import { CreateProject } from "./creates/CreateProject";
import { DeleteProject } from "./deletes/DeleteProject";
import { ChangeProject } from "./updates/ChangeProject";
import { useProject } from "@/hooks/projectContext";
import Badge from "./Badge";

export interface ProjectDto {
  id: string;
  name: string;
  description: string | null;
  status: string;
  createdAt: string;
  createdBy: string;
}

export default function ProjectsList() {
  const { selectedProjectId, setSelectedProjectId, fetchProjectDetails } =
    useProject();
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState<ProjectDto | null>(
    null,
  );

  const fetchProjects = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return;
      }
      const response = await axios.get("api/projects/my-projects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const status = error.response.status;

          if (status === 401) {
            localStorage.removeItem("authToken");
            router.replace("/login");
          }
        }
      }
    }
  }, []);

  const [refreshProjects, setRefreshProjects] = useState(false);
  const [refreshProjectsAfterDelete, setRefreshProjectsAfterDelete] =
    useState(false);
  useEffect(() => {
    if (refreshProjects) {
      setRefreshProjects(false);
      fetchProjectDetails(selectedProjectId);
    }
    if (refreshProjectsAfterDelete) {
      setRefreshProjectsAfterDelete(false);
      fetchProjectDetails(null);
    }
    fetchProjects();
  }, [refreshProjects, fetchProjects, refreshProjectsAfterDelete]);

  const refreshProjectsList = () => {
    setRefreshProjects(true);
  };

  const refreshProjectsListAfterDelete = () => {
    setRefreshProjects(true);
    setRefreshProjectsAfterDelete(true);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredProjects = projects
    .filter((project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleCloseDeleteModal = () => {
    (
      document.getElementById("delete-project-modal") as HTMLDialogElement
    )?.close();
  };
  const handleCloseChangeModal = () => {
    (
      document.getElementById("change-project-modal") as HTMLDialogElement
    )?.close();
  };

  return (
    <div className="w-1/4">
      <div className=" pl-3 pr-1 flex flex-row space-x-2">
        <form className="flex-grow">
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              className="block w-full p-3 ps-9 text-sm text-gray-100 shadow-xl rounded-lg focus:ring-green-500 focus:border-green-500  bg-base-100 bg-opacity-50"
              placeholder="Wyszukaj projekt"
              value={searchTerm}
              onChange={handleSearchChange}
              required
            />
          </div>
        </form>
        <button
          className="btn btn-square bg-gradient-to-r text-white from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80"
          onClick={() =>
            (
              document.getElementById(
                "create-project-modal",
              ) as HTMLDialogElement
            )?.showModal()
          }
        >
          <i className="fi fi-br-plus"></i>
        </button>
      </div>
      <div className="py-3 pl-3 pr-1 h-screen-minus-8.5rem justify-between overflow-y-auto">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="card card-compact bg-base-100 bg-opacity-40 w-full shadow-xl mb-4 hover:bg-base-100"
            onClick={() => setSelectedProjectId(project.id)}
          >
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              >
                <i className="fi fi-bs-menu-dots-vertical"></i>
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-[1] w-32 p-2 shadow"
              >
                <li>
                  <a
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProject(project);
                      (
                        document.getElementById(
                          "change-project-modal",
                        ) as HTMLDialogElement
                      )?.showModal();
                    }}
                  >
                    <i className="fi fi-rr-pencil"></i> Edytuj
                  </a>
                </li>
                <li>
                  <a
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProject(project);
                      (
                        document.getElementById(
                          "delete-project-modal",
                        ) as HTMLDialogElement
                      )?.showModal();
                    }}
                  >
                    <i className="fi fi-rs-trash"></i> Usuń
                  </a>
                </li>
              </ul>
            </div>
            <div className="card-body">
              <h2 className="card-title overflow-hidden w-11/12">
                {project.name}
              </h2>
              <p className="w-72 overflow-hidden text-ellipsis">
                {project.description?.substring(0, 120)}
              </p>
              <Badge status={project.status} />
            </div>
          </div>
        ))}
      </div>
      <dialog id="create-project-modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <div className="flex items-center justify-between p-2 border-b rounded-t dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Stwórz nowy projekt
            </h3>
          </div>
          <CreateProject onProjectCreated={refreshProjectsList} />
        </div>
      </dialog>
      <dialog id="change-project-modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <div className="flex items-center justify-between p-2 border-b rounded-t dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Edytuj projekt
            </h3>
          </div>
          {selectedProject && (
            <ChangeProject
              project={selectedProject}
              onProjectUpdated={refreshProjectsList}
              onClose={handleCloseChangeModal}
            />
          )}
        </div>
      </dialog>
      <dialog id="delete-project-modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <DeleteProject
            projectId={selectedProject?.id}
            onProjectDeleted={refreshProjectsListAfterDelete}
            onClose={handleCloseDeleteModal}
          />
        </div>
      </dialog>
    </div>
  );
}
