"use client";
import axios from "axios";
import router from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";

interface DeleteMemberProps {
  projectId: string | undefined;
  memberId: string | undefined;
  onMemberDeleted: () => void;
  onClose: () => void;
}

export const DeleteMember: React.FC<DeleteMemberProps> = ({ projectId, memberId, onMemberDeleted, onClose }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setLoading(false);
        router.replace('/login');
        return;
      }
      await axios.delete(`api/project-teams/${projectId}/${memberId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
      },);
      onMemberDeleted();
      toast.success('Członek został usunięty!', { position: "bottom-center"});
      onClose();
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
      } else {
        toast.error('Błąd połączenia z serwerem!', { position: "bottom-center"});
      }
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-5 text-center">
      <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
      </svg>
      <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Jesteś pewny, że chcesz usunąć tego członka z projektu?</h3>
      <button className="btn text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
        onClick={handleDelete}>
          {loading ? (
          <>
            <span className="loading loading-spinner"></span>
          </>
        ) : (
          'Tak, jestem pewny'
        )}
      </button>
      <button className="btn py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        onClick={()=>onClose()}>
        Nie, anuluj
      </button>
    </div>
  );
};