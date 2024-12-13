import { useState } from "react";

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
        setError(errorData.derail || 'Błąd logowania');
      }
    } catch (error) {
      console.log(error);
      setError('Błąd połączenia z serwerem');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="username">Nazwa użytkownika</label>
      <input
        type="text"
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
       />

       <label htmlFor="password">Hasło:</label>
       <input
         type="password"
         id="password"
         value={password}
         onChange={(e) => setPassword(e.target.value)}
         required
       />

      <button type="submit">Zaloguj się</button>

      {error && <p className="text-red-500">{error}</p>}
    </form>
  )
}