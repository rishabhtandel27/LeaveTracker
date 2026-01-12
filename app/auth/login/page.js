"use client";

import LandingPage from "../../_components/LandingPage";

export default function LoginPage() {
  return <LandingPage isLogin={true} />;
}

/* ORIGINAL CODE - KEPT AS BACKUP
"use client";

import React, { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";

export default function LoginButton() {
  const router = useRouter();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const storedAllUsers = localStorage.getItem("users");
    const users = storedAllUsers ? JSON.parse(storedAllUsers) : [];

    const user = users.find(
      (u) => u.email === loginData.email && u.password === loginData.password
    );

    if (!user) {
      toast.error("Invalid credentials");
      return;
    }

    localStorage.setItem("currentuser", JSON.stringify(user));
    toast.success("Logged in successfully");
    router.push("/");
  }

  return (
    <div className="flex justify-center items-center min-h-screen px-4 bg-linear-to-br from-purple-600 via-purple-500 to-indigo-600">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center w-full max-w-md mx-auto gap-5 p-10 bg-white rounded-3xl shadow-2xl"
      >
        <h2 className="text-gray-900 font-bold text-3xl sm:text-4xl mb-4">
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          name="email"
          className="py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl w-full text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          required
          onChange={handleChange}
        />

        <input
          type="password"
          placeholder="Password"
          name="password"
          className="py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl w-full text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          required
          onChange={handleChange}
        />

        <button
          type="submit"
          className="w-full py-3.5 px-6 bg-linear-to-r from-purple-600 to-indigo-600 rounded-full font-bold text-white hover:from-purple-700 hover:to-indigo-700 transform hover:scale-105 transition-all shadow-lg"
        >
          LOG IN
        </button>

        <Link
          href="/auth/signup"
          className="text-gray-500 text-sm hover:text-purple-600 transition-colors"
        >
          Don&apos;t have an account?{" "}
          <span className="text-purple-600 font-semibold">Sign up</span>
        </Link>
      </form>
    </div>
  );
}*/
