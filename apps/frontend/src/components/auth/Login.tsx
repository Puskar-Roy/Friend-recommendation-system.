import { useState, ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import { LoginFormData } from "../../interfaces";
import { useLogin } from "@/hooks/useLogin";
const Login = () => {
  const { login, error, isLoading, isSucess } = useLogin();

    const [formData, setFormData] = useState<LoginFormData>({
      email: "",
      password: "",
    });
    const { email, password } = formData;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      await login(formData);
    };

  return (
    <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12 sm:w-[60%] sm:mx-auto flex justify-center items-center h-[70vh]">
      <div className="mt-12 flex flex-col justify-center items-center">
        <h1 className="text-2xl xl:text-3xl font-extrabold text-indigo-400 ubuntu-bold">
          Login
        </h1>
        <div className="w-full flex-1 mt-8">
          <form onSubmit={handleSubmit} className="mx-auto max-w-xs">
            <input
              className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={handleChange}
              autoComplete="email"
            />
            <input
              className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={handleChange}
              autoComplete="current-password"
            />
            <button
              disabled={isLoading}
              className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
            >
             
              <span className="ml-3">Login</span>
            </button>
            {error && (
              <div className="bg-rose-200 text-rose-500 p-5 rounded-lg mt-4">
                Invalid credentials
              </div>
            )}
            {isSucess && (
              <div className="bg-green-200 text-green-500 p-5 rounded-lg mt-4">
                Login Done!
              </div>
            )}
            <p className="mt-6 text-xs text-gray-600 text-center">
              Did not have an account?
              <Link
                to="/register"
                className="border-b text-indigo-400 border-gray-500 border-dotted"
              >
                {" "}
                Register Here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;