"use client";
import { AppLogo } from "@/components/AppLogo";
import AuthForm from "@/components/auth/AuthForm";
import { useRouter } from "next/navigation";

export interface UserData {
  token: string;
}

const Login: React.FC = () => {
  const router = useRouter();

  const handleLogin = (userData: string) => {
    localStorage.setItem("authToken", userData);
    router.push("/home");
  };

  return (
    <div className="flex flex-col min-h-screen w-screen items-center justify-center bg-gray-900 p-8 overflow-y-auto">
      <AppLogo />
      <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
        <AuthForm isLogin={true} onAuth={handleLogin} />
      </div>
    </div>
  );
};

export default Login;
