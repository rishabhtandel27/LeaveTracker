"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import {
  MdCalendarToday,
  MdSpeed,
  MdInsights,
  MdCheckCircle,
} from "react-icons/md";

export default function LandingPage({ isLogin: initialIsLogin = true }) {
  const [isLogin, setIsLogin] = useState(initialIsLogin);

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-500 via-indigo-500 to-purple-600 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">
        {/* Left Side - Information */}
        <div className="bg-linear-to-br from-purple-500 to-indigo-500 p-12 flex flex-col justify-center text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <MdCalendarToday className="text-3xl text-purple-500" />
            </div>
            <h1 className="text-3xl font-bold">LeaveTracker</h1>
          </div>

          <h2 className="text-4xl font-bold mb-6 leading-tight">
            Manage Your Time Off Seamlessly
          </h2>

          <p className="text-lg text-purple-100 mb-8 leading-relaxed">
            Simplify leave requests, approvals, and tracking with our intuitive
            platform designed for modern teams.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                <MdSpeed className="text-2xl" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Quick Requests</h3>
                <p className="text-purple-100">
                  Submit leave requests in seconds with our streamlined
                  interface.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                <MdInsights className="text-2xl" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Real-time Tracking</h3>
                <p className="text-purple-100">
                  Monitor leave balances and team availability at a glance.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                <MdCheckCircle className="text-2xl" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Easy Approvals</h3>
                <p className="text-purple-100">
                  Admins can review and approve requests instantly.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form Container */}
        <div className="p-0 flex flex-col justify-center">
          {isLogin ? (
            <LoginForm onToggle={toggleMode} />
          ) : (
            <SignupForm onToggle={toggleMode} />
          )}
        </div>
      </div>
    </div>
  );
}

// Login Form Component (from auth/login logic)
function LoginForm({ onToggle }) {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!loginData.email || !loginData.password) {
      setError("Email and password are required");
      setIsSubmitting(false);
      return;
    }

    // Email format validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(loginData.email)) {
      setError("Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }

    // Check if email contains at least one letter
    if (!/[a-zA-Z]/.test(loginData.email.split("@")[0])) {
      setError("Email must contain at least one letter before @");
      setIsSubmitting(false);
      return;
    }

    const storedAllUsers = localStorage.getItem("users");
    const users = storedAllUsers ? JSON.parse(storedAllUsers) : [];

    const user = users.find(
      (u) => u.email === loginData.email && u.password === loginData.password
    );

    if (!user) {
      setError("Invalid email or password");
      setIsSubmitting(false);
      return;
    }

    localStorage.setItem("currentuser", JSON.stringify(user));
    toast.success("Logged in successfully");
    // Direct admins to dashboard; employees to home
    window.location.href = user.role === "admin" ? "/dashboard/admin" : "/";
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center w-full p-12 bg-white"
    >
      <h2 className="text-gray-900 font-bold text-3xl sm:text-4xl mb-6">
        Welcome Back
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm w-full">
          {error}
        </div>
      )}

      <input
        type="email"
        placeholder="Email"
        name="email"
        value={loginData.email}
        onChange={handleChange}
        className="py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl w-full text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all mb-4"
        required
      />

      <input
        type="password"
        placeholder="Password"
        name="password"
        value={loginData.password}
        onChange={handleChange}
        className="py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl w-full text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all mb-6"
        required
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full cursor-pointer py-3.5 px-6 bg-linear-to-r from-purple-500 to-indigo-500 rounded-full font-bold text-white hover:from-purple-700 hover:to-indigo-700 transform hover:scale-105 transition-all shadow-lg disabled:opacity-50"
      >
        {isSubmitting ? "Logging in..." : "LOGIN"}
      </button>

      <button
        type="button"
        onClick={() => (window.location.href = "/auth/signup")}
        className="text-gray-500 text-sm hover:text-purple-600 transition-colors mt-4"
      >
        Don&apos;t have an account?{" "}
        <span className="text-purple-600 font-semibold">Sign up</span>
      </button>
    </form>
  );
}

// Signup Form Component (from auth/signup logic)
function SignupForm({ onToggle }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  }

  function handleSignUp(e) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const { username, email, password, confirmPassword, role } = formData;

    // Empty field validation
    if (!username || !email || !password || !confirmPassword) {
      setError("Please fill all fields");
      setIsSubmitting(false);
      return;
    }

    // Email format validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }

    // Check if email contains at least one letter
    if (!/[a-zA-Z]/.test(email.split("@")[0])) {
      setError("Email must contain at least one letter before @");
      setIsSubmitting(false);
      return;
    }

    // Username validation - only characters allowed
    const usernameRegex = /^[a-zA-Z]+$/;
    if (!usernameRegex.test(username)) {
      setError("Please enter a valid username. Only characters are allowed");
      setIsSubmitting(false);
      return;
    }

    // Password format validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "Password must contain: 8+ characters, uppercase, lowercase, number, and special character (@$!%*?&)"
      );
      setIsSubmitting(false);
      return;
    }

    // Password match validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    // Role selection validation
    if (!role) {
      setError("Please select a role");
      setIsSubmitting(false);
      return;
    }

    // Get existing users
    const storedUsers = localStorage.getItem("users");
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    // Check duplicate email
    const userExists = users.find((u) => u.email === email);
    if (userExists) {
      setError("User already exists");
      setIsSubmitting(false);
      return;
    }

    // Save new user
    users.push(formData);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentuser", JSON.stringify(formData));
    toast.success("Account created successfully");

    // Direct admins to dashboard; employees to home
    window.location.href = formData.role === "admin" ? "/dashboard/admin" : "/";
  }

  return (
    <form
      onSubmit={handleSignUp}
      className="flex flex-col items-center w-full p-12 bg-white max-h-[calc(100vh-2rem)] overflow-y-auto"
    >
      <h2 className="text-gray-900 font-bold text-3xl sm:text-4xl mb-6">
        Sign Up
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm w-full">
          {error}
        </div>
      )}

      <input
        type="text"
        placeholder="Username"
        name="username"
        value={formData.username}
        onChange={handleChange}
        className="py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl w-full text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all mb-4"
        required
      />

      <input
        type="email"
        placeholder="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        className="py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl w-full text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all mb-4"
        required
      />

      <input
        type="password"
        placeholder="Password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        className="py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl w-full text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all mb-4"
        required
      />

      <input
        type="password"
        placeholder="Confirm Password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        className="py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl w-full text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all mb-4"
        required
      />

      <select
        id="role"
        name="role"
        value={formData.role}
        onChange={handleChange}
        className="py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl w-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all mb-6"
      >
        <option value="" disabled>
          Select Role
        </option>
        <option value="admin">Admin</option>
        <option value="employee">Employee</option>
      </select>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full cursor-pointer py-3.5 px-6 bg-linear-to-r from-purple-600 to-indigo-600 rounded-full font-bold text-white hover:from-purple-700 hover:to-indigo-700 transform hover:scale-105 transition-all shadow-lg disabled:opacity-50"
      >
        {isSubmitting ? "Creating Account..." : "CREATE ACCOUNT"}
      </button>

      <button
        type="button"
        onClick={() => (window.location.href = "/auth/login")}
        className="text-gray-500 text-sm hover:text-purple-600 transition-colors mt-4"
      >
        Already have an account?{" "}
        <span className="text-purple-600 font-semibold">Login</span>
      </button>
    </form>
  );
}
