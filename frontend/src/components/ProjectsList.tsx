"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import router from "next/router";

interface ProjectDto {
  id: string;
  name: string;
  description: string | null;
  status: string;
  createdAt: string;
  createdBy: string;
}

export default function ProjectsList() {
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<React.ReactNode | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setLoading(false);
          return;
        }
        const response = await axios.get('api/projects/my-projects', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(response.data);
      }
      catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            const status = error.response.status;

            if (status === 401) {
              localStorage.removeItem('authToken');
              router.replace('/login');
              setError(<li>{'Nieupoważniony dostęp. Zaloguj się ponownie.'}</li>);
            }
            if (Array.isArray(error.response.data)) {
              const errorListItems = error.response.data
                .filter(err => err.description)
                .map((err, index) => (<li key={index}>{err.description}</li>));
                setError(errorListItems);
            } else {
              setError(<li>{'Błąd połączenia z serwerem'}</li>);
            }
          } else {
            setError(<li>{'Błąd rejestracji'}</li>);
          }
        } else {
          setError(<li>{'Nieoczekiwany błąd'}</li>);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <div className="w-1/4 px-3 flex flex-row space-x-2">
        <form className="flex-grow">
          <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
          <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                  </svg>
              </div>
              <input type="search" id="default-search" className="block w-full p-3 ps-10 text-sm text-gray-100 shadow-xl rounded-lg focus:ring-green-500 focus:border-green-500  bg-base-100 bg-opacity-50"
                placeholder="Wyszukaj projekt"
                value={searchTerm}
                onChange={handleSearchChange}
                required />
          </div>
        </form>
        <button className="btn btn-square bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80">
          <i className="fi fi-br-plus"></i>
        </button>
      </div>

      <div className="p-3 h-screen-minus-8.5rem w-1/4 justify-between overflow-y-auto">
        {filteredProjects.map((project) => (
          <div key={project.id} className="card card-compact bg-base-100 bg-opacity-40 w-full shadow-xl mb-4">
            <div className="card-body">
              <h2 className="card-title">{project.name}</h2>
              <p className="w-72 overflow-hidden text-ellipsis">{project.description?.substring(0, 120)}</p>
              <span className="px-2 pb-1 w-fit h-fit rounded-md font-bold bg-gray-100 bg-opacity-10 border border-gray-500 select-none">
                {project.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}