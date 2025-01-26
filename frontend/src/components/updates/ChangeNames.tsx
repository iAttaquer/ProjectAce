"use client";
import React, { useState } from "react";
import axios from "axios";
import router from "next/router";
import { toast } from "react-hot-toast";
import { useUser } from "@/hooks/userContext";

export const ChangeNames = () => {
  const { refreshUserData } = useUser();
  const [firstname, setFirstname] = useState<string | null>(null);
  const [lastname, setLastname] = useState<string | null>(null);
  const [error, setError] = useState<React.ReactNode | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setLoading(false);
        router.replace("/login");
        return;
      }
      await axios.put(
        "/api/account/update-names",
        {
          firstname,
          lastname,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Nazwa została zmieniona!", { position: "bottom-center" });
      refreshUserData();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const status = error.response.status;
          console.log(error.response.data); // for debug

          if (status === 401) {
            localStorage.removeItem("authToken");
            router.push("/login");
            setError(<li>{"Nieupoważniony dostęp. Zaloguj się ponownie."}</li>);
          }
          if (Array.isArray(error.response.data)) {
            const errorListItems = error.response.data
              .filter((err) => err.description)
              .map((err, index) => <li key={index}>{err.description}</li>);
            setError(errorListItems);
          } else {
            setError(<li>{"Błąd połączenia z serwerem"}</li>);
          }
        } else {
          setError(<li>{"Błąd rejestracji"}</li>);
        }
      } else {
        console.log(error);
        setError(<li>{"Nieoczekiwany błąd"}</li>);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="w-full">
      <label
        htmlFor="firstname"
        className="block mt-1.5 mb-1 text-sm font-medium text-gray-900 dark:text-white"
      >
        Imie
      </label>
      <input
        type="text"
        name="firstname"
        id="firstname"
        placeholder="imie"
        value={firstname ?? ""}
        onChange={(e) => {
          setFirstname(e.target.value);
        }}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
        required
      />
      <label
        htmlFor="lastname"
        className="block mt-1.5 mb-1 text-sm font-medium text-gray-900 dark:text-white"
      >
        Nowe hasło
      </label>
      <input
        type="text"
        name="lastname"
        id="lastname"
        placeholder="nazwisko"
        value={lastname ?? ""}
        onChange={(e) => {
          setLastname(e.target.value);
        }}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
        required
      />
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
          "Zmień"
        )}
      </button>
    </form>
  );
};
