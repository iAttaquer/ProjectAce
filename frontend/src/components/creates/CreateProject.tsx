"use client";
import axios from "axios";
import router from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";

interface CreateProjectProps {
  onProjectCreated: () => void;
}

export const CreateProject: React.FC<CreateProjectProps> = ({
  onProjectCreated,
}) => {
  const [name, setName] = useState<string>("");
  const [status, setStatus] = useState<string>("Aktywny");
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<React.ReactNode | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setLoading(false);
        router.replace("/login");
        return;
      }
      await axios.post(
        "api/projects",
        {
          name,
          description,
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      onProjectCreated();
      setName("");
      setDescription("");
      setStatus("Aktywny");
      toast.success("Projekt został utworzony!", { position: "bottom-center" });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const status = error.response.status;
          // console.log(error);

          if (status === 401) {
            localStorage.removeItem("authToken");
            setError(<li>{"Nieupoważniony dostęp. Zaloguj się ponownie."}</li>);
            router.replace("/login");
            return;
          }
          if (
            error.response.data &&
            typeof error.response.data.errors === "object"
          ) {
            const errorListItems: React.ReactNode[] = [];
            for (const key in error.response.data.errors) {
              error.response.data.errors[key].forEach((message: string) => {
                errorListItems.push(
                  <li key={`${key}-${message}`}>{message}</li>,
                );
              });
            }
            setError(errorListItems);
          } else {
            setError(<li>{"Błąd połączenia z serwerem"}</li>);
          }
        } else {
          setError(<li>{"Błąd!"}</li>);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mt-2">
      <label
        htmlFor="projectName"
        className="block mt-1.5 mb-1 text-sm font-medium text-gray-900 dark:text-white"
      >
        Nazwa projektu
      </label>
      <input
        type="text"
        name="projectName"
        id="projectName"
        placeholder="nazwa projektu"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
        required
      />
      <label
        htmlFor="status"
        className="block mb-1 mt-1.5 text-sm font-medium text-gray-900 dark:text-white"
      >
        Status
      </label>
      <select
        id="status"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
        value={status}
        onChange={(e) => {
          setStatus(e.target.value);
        }}
      >
        <option value="Aktywny">Aktywny</option>
        <option value="Wstrzymany">Wstrymany</option>
        <option value="Zakończony">Zakończony</option>
      </select>
      <label
        htmlFor="description"
        className="block mb-1 mt-1.5 text-sm font-medium text-gray-900 dark:text-white"
      >
        Opis projektu
      </label>
      <textarea
        id="description"
        rows={4}
        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="opis projektu"
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
        }}
      ></textarea>
      {error && (
        <div className="text-red-400 p-2 w-full flex flex-row gap-1">
          <i className="fi fi-bs-exclamation mt-2"></i>
          <ul className="mt-1.5">{error}</ul>
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="btn mt-4 text-white bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 disabled:text-stone-50"
      >
        {loading ? (
          <>
            <span className="loading loading-spinner"></span>
          </>
        ) : (
          "Utwórz"
        )}
      </button>
    </form>
  );
};
