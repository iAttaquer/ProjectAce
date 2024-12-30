"use client";
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ProjectDto } from '../components/ProjectsList';
import router from 'next/router';


const ProjectContext = createContext<{
  project: ProjectDto | null;
  loading: boolean;
  error: React.ReactNode | null;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  fetchProjectDetails: (id: string | null) => void;
}>({ project: null, loading: true, error: null, setSelectedProjectId: () => {}, selectedProjectId: null
  , fetchProjectDetails: () => {} });

export const ProjectProvider = ({ children }: any) => {
  const [project, setProject] = useState<ProjectDto | null>(null);
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
          // console.log(error.response.data); // for debug

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

  return (
    <ProjectContext.Provider value={{ project, loading, error, selectedProjectId, setSelectedProjectId, fetchProjectDetails }}>
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