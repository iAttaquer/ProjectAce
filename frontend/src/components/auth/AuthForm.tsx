import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";

interface AuthFormData {
  username: string;
  email?: string;
  password: string;
  firstname?: string;
  lastname?: string;
}

interface AuthFormProps {
  isLogin: boolean;
  onAuth: (data: AuthFormData) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ isLogin, onAuth }) => {
  const [formData, setFormData] = useState<AuthFormData>({
    username: "",
    password: "",
  });
  const [error, setError] = useState<React.ReactNode | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? "api/account/login" : "api/account/register";
      const response = await axios.post(endpoint, formData);
      onAuth(response.data);
    }
    catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.log(error.response.data);
          if (Array.isArray(error.response.data)) {
            const errorListItems = error.response.data
              .filter(err => err.description)
              .map((err, index) => (<li key={index}>{err.description}</li>));
              setError(errorListItems);
          } else {
            setError(<li>{error.response.data}</li>);
          }
        } else {
          setError(<li>{'Błąd połączenia z serwerem!'}</li>);
        }
      } else {
        setError(<li>{'Nieoczekiwany błąd'}</li>);
      }
    }
    finally {
      setLoading(false);
    }
  };
  
  return(
    <form onSubmit={handleSubmit} className="space-y-5">
      <h5 className="text-xl font-medium text-gray-900 dark:text-white">
        {isLogin ? "Logowanie do konta" : "Utwórz konto"}
      </h5>
      <div>
        <label htmlFor="username" className="block mb-1.5 text-sm font-medium text-gray-900 dark:text-white">
          Twoja nazwa użytkownika
        </label>
        <input type="text" name="username" value={formData.username}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
          placeholder="nazwa_użytkownika" required />
      </div>
      {!isLogin && (
        <>
          <div>
            <label htmlFor="firstname" className="block mb-1.5 text-sm font-medium text-gray-900 dark:text-white">
              Twoje imię
            </label>
            <input type="text" name="firstname" value={formData.firstname || ""}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              placeholder="imie" required />
          </div>
          <div>
            <label htmlFor="lastname" className="block mb-1.5 text-sm font-medium text-gray-900 dark:text-white">
              Twoje nazwisko
            </label>
            <input type="text" name="lastname" value={formData.lastname || ""}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              placeholder="nazwisko" required />
          </div>
          <div>
            <label htmlFor="email" className="block mb-1.5 text-sm font-medium text-gray-900 dark:text-white">
              Twój email
            </label>
            <input type="email" name="email" value={formData.email || ""}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              placeholder="przykladowy@mail.com" required />
          </div>
        </>
      )}
      <div>
        <label htmlFor="password" className="block mb-1.5 text-sm font-medium text-gray-900 dark:text-white">
          Twoje hasło
        </label>
        <input type="password" name="password" value={formData.password}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
          placeholder="••••••••" required />
      </div>
      <button type="submit" disabled={loading}
        className="btn w-full text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 disabled:text-stone-50">
        {loading ? (
          <>
            <span className="loading loading-spinner"></span>
            {isLogin ? "Logowanie..." : "Rejestracja..."}
          </>
        ) : (
          isLogin ? 'Zaloguj się' : 'Zarejestruj się'
        )}
      </button>
      {error &&
        <div className="text-red-400 p-2 w-full flex flex-row gap-1">
          <i className="fi fi-bs-exclamation mt-2"></i>
          <ul className="mt-1.5">
          {error}
          </ul>
        </div>}
      <div className="text-sm font-medium text-gray-500 dark:text-gray-300 mt-2">
        {isLogin ? (
          "Nie masz konta? "
        ) : (
          "Masz już konto? "
        )}
        <Link href={isLogin ? "/register" : "/login"}>
          <button className="btn btn-link btn-sm p-1.5 text-blue=-700 hover:underline dark:text-blue-500">
            {isLogin ? "Zarejestruj się" : "Zaloguj się"}
          </button>
        </Link>
      </div>
    </form>
  );
}

export default AuthForm;