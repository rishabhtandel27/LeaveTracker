"use client";

import LandingPage from "../../_components/LandingPage";

export default function SignupPage() {
  return <LandingPage isLogin={false} />;
}

/* ORIGINAL CODE - KEPT AS BACKUP
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

export default function Signup() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "employee",
  });

  // handle input change
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // signup logic
  function handleSignUp(e) {
    e.preventDefault();

    const { username, email, password, confirmPassword } = formData;

    // 1️⃣ Empty field validation
    if (!username || !email || !password || !confirmPassword) {
      toast.warn("Please fill all fields");
      return;
    }

    // 1.5️⃣ Username validation - only characters allowed
    const usernameRegex = /^[a-zA-Z]+$/;
    if (!usernameRegex.test(username)) {
      toast.error("Please enter a valid username. Only characters are allowed");
      return;
    }

    // 2️⃣ Password format validation - professional standards
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must contain: 8+ characters, uppercase, lowercase, number, and special character (@$!%*?&)"
      );
      return;
    }

    // 3️⃣ Password match validation
    if (password !== confirmPassword) {
      toast.warn("Passwords do not match");
      return;
    }

    // 3️⃣ Get existing users
    const storedUsers = localStorage.getItem("users");
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    // 4️⃣ Check duplicate email
    const userExists = users.find((u) => u.email === email);
    if (userExists) {
      toast.error("User already exists");
      return;
    }

    // 5️⃣ Save new user
    users.push(formData);
    localStorage.setItem("users", JSON.stringify(users));

    toast.success("Account created successfully");

    // 6️⃣ Redirect to login
    router.push("/auth/login");
  }

  return (
    <div className="flex justify-center items-center min-h-screen px-4 bg-linear-to-br from-purple-600 via-purple-500 to-indigo-600">
      <form
        onSubmit={handleSignUp}
        className="flex flex-col items-center w-full max-w-md mx-auto gap-5 p-10 bg-white rounded-3xl shadow-2xl"
      >
        <h2 className="text-gray-900 font-bold text-3xl sm:text-4xl mb-4">
          Sign Up
        </h2>

        <input
          type="text"
          placeholder="Username"
          name="username"
          className="py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl w-full text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          required
          onChange={handleChange}
        />

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

        <input
          type="password"
          placeholder="Confirm Password"
          name="confirmPassword"
          className="py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl w-full text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          required
          onChange={handleChange}
        />

        <select
          id="role"
          name="role"
          onChange={handleChange}
          className="py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl w-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
        >
          <option className="text-gray-800" value="">
            Select Role
          </option>
          <option className="text-gray-800" value="admin">
            Admin
          </option>
          <option className="text-gray-800" value="employee">
            Employee
          </option>
        </select>

        <button
          type="submit"
          className="w-full cursor-pointer py-3.5 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full font-bold text-white hover:from-purple-700 hover:to-indigo-700 transform hover:scale-105 transition-all shadow-lg"
        >
          CREATE ACCOUNT
        </button>

        <Link
          href="/auth/login"
          className="text-gray-500 text-sm hover:text-purple-600 transition-colors"
        >
          Already have an account?{" "}
          <span className="text-purple-600 font-semibold">Login</span>
        </Link>
      </form>
    </div>
  );
}*/
