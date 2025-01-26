"use client";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/auth/AuthForm";
import { AppLogo } from "@/components/AppLogo";

const Register: React.FC = () => {
  const router = useRouter();

  const handleRegister = () => {
    router.push("/login");
  };

  return (
    <div className="flex flex-col min-h-screen w-screen items-center justify-center bg-gray-900 p-8 overflow-y-auto">
      <AppLogo />
      <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
        <AuthForm isLogin={false} onAuth={handleRegister} />
      </div>
    </div>
  );
};

export default Register;
