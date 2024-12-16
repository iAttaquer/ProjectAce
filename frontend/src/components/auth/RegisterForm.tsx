import React, { useState } from "react";
import Link from 'next/link';
import axios from "axios";

interface RegisterUserData {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export const RegisterForm: React.FC<{ onRegister:(data: RegisterUserData) => void }> = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<React.ReactNode | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/account/register', {
        username, email, password, firstname, lastname
      });

      onRegister(response.data);

    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.log(error.response.data);
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

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
        <h5 className="text-xl font-medium text-gray-900 dark:text-white">Utwórz konto</h5>
        <div>
            <label htmlFor="username"
              className="block mb-1.5 text-sm font-medium text-gray-900 dark:text-white">
                Twoja nazwa użytkownika
              </label>
            <input type="text" name="username" id="username"
              value={username}
              onChange={(e) => {setUsername(e.target.value)}}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="nazwa_użytkownika" required />
        </div>
        <div>
            <label htmlFor="firstname"
              className="block mb-1.5 text-sm font-medium text-gray-900 dark:text-white">
                Twoje imię
              </label>
            <input type="text" name="firstname" id="firstname"
              value={firstname}
              onChange={(e) => {setFirstname(e.target.value)}}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Imie" required />
        </div>
        <div>
            <label htmlFor="lastname"
              className="block mb-1.5 text-sm font-medium text-gray-900 dark:text-white">
                Twoje nazwisko
              </label>
            <input type="text" name="lastname" id="lastname"
              value={lastname}
              onChange={(e) => {setLastname(e.target.value)}}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Nazwisko" required />
        </div>
        <div>
            <label htmlFor="email"
              className="block mb-1.5 text-sm font-medium text-gray-900 dark:text-white">
                Twój email
              </label>
            <input type="email" name="email" id="email"
              value={email}
              onChange={(e) => {setEmail(e.target.value)}}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="przykladowy@mail.com" required />
        </div>
        <div>
            <label htmlFor="password"
              className="block mb-1.5 text-sm font-medium text-gray-900 dark:text-white">
                Twoje hasło
              </label>
            <input type="password" name="password" id="password" placeholder="••••••••"
              value={password}
              onChange={(e) => {setPassword(e.target.value)}}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
        </div>
        <button type="submit" disabled={loading}
          className="btn w-full text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 disabled:text-stone-50">
          {loading ? (
            <>
              <span className="loading loading-spinner"></span>
              Rejestracja...
            </>
          ) : (
            'Zarejestruj się'
          )}
        </button>
        {error && 
          <div className="text-red-400 p-2 w-full flex flex-row gap-1">
            <i className="fi fi-bs-exclamation mt-2"></i>
            <ul className="mt-1.5">
            {error}
            </ul>
          </div>}
        <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
            Masz już konto?
            <Link href="/login">
              <button className="btn btn-link btn-sm p-1.5 text-blue-700 hover:underline dark:text-blue-500">Zaloguj się</button>
            </Link>
        </div>
    </form>
  );
}