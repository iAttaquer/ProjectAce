import { useState } from "react";
import Link from 'next/link';
import axios from "axios";

interface LoginUserData {
  username: string;
  password: string;
}
export const LoginForm: React.FC<{ onLogin:(data: LoginUserData) => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<React.ReactNode | null>(null);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('api/account/login', 
        { username, password }
      );

      onLogin(response.data);

    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setError(<li>{error.response.data}</li>);
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
        <h5 className="text-xl font-medium text-gray-900 dark:text-white">Logowanie do konta</h5>
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
          className="btn w-full text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 disabled:text-stone-50">
          {loading ? (
            <>
              <span className="loading loading-spinner"></span>
              Logowanie...
            </>
          ) : (
            'Zaloguj się'
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
            Nie masz konta?
            <Link href="/register">
              <button className="btn btn-link btn-sm p-1.5 text-blue-700 hover:underline dark:text-blue-500">Zarejestruj się</button>
            </Link>
        </div>
    </form>
    )
}