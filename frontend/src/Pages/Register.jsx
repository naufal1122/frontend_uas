import React, { useEffect } from "react";

import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { register as registerUser } from "../Action/Auth";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const { register, handleSubmit, resetField } = useForm();
  const navigate = useNavigate();

  const { mutate, status, data } = useMutation(registerUser);

  useEffect(() => {
    if (status === "success") {
      if (data?.data?.success) {
        navigate("/login");
        resetField();
        toast("Register Success, Please Login");
      } else {
        toast.error(data?.response?.data?.message);
      }
    }
  }, [status]);

  return (
    <section className="bg-light-50 dark:bg-light-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <Link
          to="/"
          className="flex items-center mb-6 text-2xl font-semibold text-sm text-gray-500 dark:text-gray-500"
        >
          StudentSystem
        </Link>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 light:bg-gray-800 light:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-gray">
              Register
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit(mutate)}
            >
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-gray">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 light:bg-gray-700 dark:border-light-600 dark:placeholder-light-400 light:text-white light:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Full Name"
                  required=""
                  {...register("name")}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-gray">
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 light:bg-gray-700 dark:border-light-600 dark:placeholder-light-400 light:text-white light:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@example.com"
                  required=""
                  {...register("email")}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-gray">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="????????????????????????"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 light:bg-gray-700 dark:border-light-600 dark:placeholder-light-400 light:text-white light:focus:ring-blue-500 dark:focus:border-blue-500"
                  required=""
                  {...register("password")}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-gray">
                  Role
                </label>
                <select
                  name="role"
                  id="role"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 light:bg-gray-700 dark:border-light-600 dark:placeholder-light-400 light:text-white light:focus:ring-blue-500 dark:focus:border-blue-500"
                  required=""
                  {...register("role")}
                  defaultValue="user"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <button className="w-full px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-primary">
                Sign In
              </button>

              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}