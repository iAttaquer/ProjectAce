import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-8">
      <div className="max-w-2xl px-4 text-center space-y-10">
        <div className="flex flex-row justify-center items-center">
          <h1 className="project-title1 text-8xl font-bold text-gray-500">Project</h1>
          <h1 className="project-title2 text-9xl font-bold text-green-500">ACE</h1>
        </div>
        <p className="text-lg text-gray-300 mb-10">
          Innowacyjna aplikacja do zarządzania projektami, która ułatwia pracę zespołową i zwiększa efektywność.
        </p>

        <div className="space-x-4">
          <Link href='/register'>
            <button className="btn text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 ">
              Zarejestruj się
            </button>
          </Link>
          <Link href="/login">
            <button className="btn text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
              Zaloguj się
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
