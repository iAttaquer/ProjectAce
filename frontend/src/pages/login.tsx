import Link from 'next/link';
import {LoginForm , SubmitButton} from '../components/auth/LoginForm';
import { useRouter } from 'next/router';

const Login = () => {
  const router = useRouter();

  const handleLogin = (userData) => {
    router.push('/');

    localStorage.setItem('token', userData.token);

    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
          <h3 className="text-xl font-semibold">Sign In</h3>
          <p className="text-sm text-gray-500">
            Use your email and password to sign in
          </p>
        </div>
        <LoginForm
         onLogin={handleLogin}
        >
          <SubmitButton>Sign in</SubmitButton>
          <p className="text-center text-sm text-gray-600">
            {"Don't have an account? "}
            <Link href="/register" className="font-semibold text-gray-800">
              Sign up
            </Link>
            {' for free.'}
          </p>
        </LoginForm>
      </div>
    </div>
  )
}

export default Login;