<<<<<<< HEAD
"use client";
import { useRouter } from 'next/navigation';
import { RegisterForm } from '../../components/auth/RegisterForm';
import { AppLogo } from '@/components/AppLogo';

const Register = () => {
=======
import { useRouter } from 'next/router';

export function Register() {
>>>>>>> 92d0d8a (feat: add simple home page)
  const router = useRouter();

  const handleRegister = (userData) => {
    router.push('/');
  };

  return (
<<<<<<< HEAD
    <div className="flex flex-col min-h-screen w-screen items-center justify-center bg-gray-900 p-8 overflow-y-auto">
      <AppLogo />
      <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
        <RegisterForm
          onRegister={handleRegister}
          />
      </div>
    </div>
  );
}

export default Register;
=======
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
          <h3 className="text-xl font-semibold">Sign Up</h3>
          <p className="text-sm text-gray-500">
            Use your email and password to sign up
          </p>
        </div>
        <LoginForm
         onLogin={handleRegister}
        />
      </div>
    </div>
  );
}
>>>>>>> 92d0d8a (feat: add simple home page)
