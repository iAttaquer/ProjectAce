import { useState } from "react";
import Link from 'next/link';
import { SubmitButton } from "./submit-button";

export function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/account/login', {
        method: 'Post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password}),
      });

      if (response.ok) {
        const data = await response.json();
        onLogin(data);
      } else {
        const errorData = await response.json();
<<<<<<< HEAD
        setError(errorData.detail || 'Błąd logowania');
=======
        setError(errorData.derail || 'Błąd logowania');
>>>>>>> 734090f (feat: add frontend init setup)
      }
    } catch (error) {
      console.log(error);
      setError('Błąd połączenia z serwerem');
    }
  };

  return (
<<<<<<< HEAD
    <form onSubmit={handleSubmit}
        className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 sm:px-16">
      <label htmlFor="username" className="block text-xs text-gray-600 uppercase">
        Nazwa użytkownika
      </label>
=======
    <form onSubmit={handleSubmit}>
      <label htmlFor="username">Nazwa użytkownika</label>
>>>>>>> 734090f (feat: add frontend init setup)
      <input
        type="text"
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
<<<<<<< HEAD
        className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
       />

       <label htmlFor="password" className="block text-xs text-gray-600 uppercase">
        Hasło:
       </label>
=======
       />

       <label htmlFor="password">Hasło:</label>
>>>>>>> 734090f (feat: add frontend init setup)
       <input
         type="password"
         id="password"
         value={password}
         onChange={(e) => setPassword(e.target.value)}
         required
<<<<<<< HEAD
         className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
       />

      <SubmitButton>Zaloguj się</SubmitButton>
      <p className="text-center text-sm text-gray-600">
        {"Don't have an account? "}
        <Link href="/register" className="font-semibold text-gray-800">
          Sign up
        </Link>
        {' for free.'}
      </p>
=======
       />

      <button type="submit">Zaloguj się</button>

>>>>>>> 734090f (feat: add frontend init setup)
      {error && <p className="text-red-500">{error}</p>}
    </form>
  )
}