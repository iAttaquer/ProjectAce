"use client";
import React, { useState } from "react";
import axios from "axios";
import router from "next/router";
import { toast } from "react-hot-toast";

export const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState<string | null>(null);
  const [newPassword2, setNewPassword2] = useState<string | null>(null);
  const [error, setError] = useState<React.ReactNode | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (newPassword !== newPassword2) {
      setError(<li>Podane hasła się różnią</li>);
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setLoading(false);
        router.push("/login");
        return;
      }
      await axios.put(
        "/api/account/change-password",
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Hasło zostało zmienione!", { position: "bottom-center" });
      setCurrentPassword("");
      setNewPassword("");
      setNewPassword2("");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const status = error.response.status;
          console.log(error.response.data); // for debug

          if (status === 401) {
            localStorage.removeItem("authToken");
            router.replace("/login");
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
        setError(<li>{"Nieoczekiwany błąd"}</li>);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <label
        htmlFor="password"
        className="block mt-1.5 mb-1 text-sm font-medium text-gray-900 dark:text-white"
      >
        Stare hasło
      </label>
      <input
        type="password"
        name="oldPassword"
        id="oldPassword"
        placeholder="••••••••"
        onChange={(e) => {
          setCurrentPassword(e.target.value);
        }}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
        required
      />
      <label
        htmlFor="password"
        className="block mt-1.5 mb-1 text-sm font-medium text-gray-900 dark:text-white"
      >
        Nowe hasło
      </label>
      <input
        type="password"
        name="newPassword1"
        id="newPassword1"
        placeholder="••••••••"
        onChange={(e) => {
          setNewPassword(e.target.value);
        }}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
        required
      />
      <label
        htmlFor="password"
        className="block mt-1.5 mb-1 text-sm font-medium text-gray-900 dark:text-white"
      >
        Powtórz nowe hasło
      </label>
      <input
        type="password"
        name="newPassword2"
        id="newPassword2"
        placeholder="••••••••"
        onChange={(e) => {
          setNewPassword2(e.target.value);
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
