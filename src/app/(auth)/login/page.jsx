"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [errors, setErrors] = useState([]);
  const router = useRouter(); // for navigation

  const handleSubmit = (e) => {
    e.preventDefault();

    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    let validationErrors = [];

    if (!email || !password) {
      validationErrors.push("All fields are required.");
    }

    if (!email.includes("@")) {
      validationErrors.push("Please enter a valid email address.");
    }

    if (password.length < 8) {
      validationErrors.push("Password must be at least 8 characters long.");
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // ✅ Login successful → redirect to dashboard
    setErrors([]);
    console.log({ email, password });

    // Redirect to dashboard
    router.push("/dashboard");
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-md p-6 bg-white rounded-2xl shadow-lg"
      >
        <fieldset>
          <legend className="text-2xl font-bold mb-2 text-center">Login</legend>
          <p className="mb-4 text-center text-gray-600">
            Enter your credentials to log in
          </p>

          {errors.length > 0 && (
            <div className="mb-4 p-3 bg-red-100 text-red-600 rounded">
              <ul className="list-disc list-inside">
                {errors.map((err, index) => (
                  <li key={index}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <label className="block mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-400 outline-none"
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              required
            />
          </div>

          <div>
            <label className="block mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-400 outline-none"
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full p-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>

          <p className="text-center mt-4 text-gray-600">
            Don’t have an account?{" "}
            <Link
              href="/register"
              className="text-blue-600 hover:underline font-medium"
            >
              Register Here
            </Link>
          </p>
        </fieldset>
      </form>
    </div>
  );
}
