"use client";
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ProjectDto } from '../components/ProjectsList';
import router from 'next/router';

export type AssignmentDto = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  createdAt: string;
  createdBy: string;
  projectId: string;
};

const ProjectContext = createContext<{
  project: ProjectDto | null;
  tasks: AssignmentDto[];
  loading: boolean;
  error: React.ReactNode | null;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  fetchProjectDetails: (id: string | null) => void;
  fetchTasks: () => void;
}>({ project: null, tasks: [], loading: true, error: null, setSelectedProjectId: () => {}, selectedProjectId: null
  , fetchProjectDetails: () => {}, fetchTasks: () => {} });

export const ProjectProvider = ({ children }: any) => {
  const [project, setProject] = useState<ProjectDto | null>(null);
  const [tasks, setTasks] = useState<AssignmentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<React.ReactNode | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const fetchProjectDetails = useCallback(async (id: string | null) => {
    if (!id) {
      setProject(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setLoading(false);
        router.replace('/login');
        return;
      }
      const response = await axios.get(`/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProject(response.data);
      setSelectedProjectId(id);
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
          setError(<li>{'Błąd'}</li>);
        }
      } else {
        setError(<li>{'Nieoczekiwany błąd'}</li>);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjectDetails(selectedProjectId);
  }, [selectedProjectId, fetchProjectDetails]);

  const fetchTasks = useCallback(async () => {
    if (!project) {
      setTasks([]);
      return;
    }
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setLoading(false);
        router.replace('/login');
        return;
      }
      const response = await axios.get(`/api/assignments/projects/${project.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
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
          setError(<li>{'Błąd'}</li>);
        }
      } else {
        setError(<li>{'Nieoczekiwany błąd'}</li>);
      }
    } finally {
      setLoading(false);
    }
  }, [project]);

  useEffect(() => {
    fetchTasks();
  }, [selectedProjectId, fetchTasks]);


  return (
    <ProjectContext.Provider value={{ project, tasks, loading, error, selectedProjectId, setSelectedProjectId, fetchProjectDetails, fetchTasks }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};