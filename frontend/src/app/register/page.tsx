"use client";
import { useRouter } from 'next/navigation';
import { RegisterForm } from '../../components/auth/RegisterForm';
import { AppLogo } from '@/components/AppLogo';

const Register = () => {
  const router = useRouter();

  const handleRegister = (userData) => {

    router.push('/login');
  };

  return (
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
