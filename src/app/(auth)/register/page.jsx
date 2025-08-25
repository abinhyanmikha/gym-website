"use client";

import Link from "next/link";

export default function Register() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Collect form data here using FormData or refs
    alert("Registration submitted!");
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-md p-6 bg-white rounded-2xl shadow-lg"
      >
        <fieldset>
          <legend className="text-2xl font-bold mb-2 text-center">
            Register
          </legend>
          <p className="mb-4 text-center text-gray-600">
            Please fill up this registration form
          </p>

          {/* Name */}
          <div>
            <label className="block mb-2" htmlFor="name">
              Name
            </label>
            <input
              className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-400 outline-none"
              type="text"
              id="name"
              placeholder="UserName"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-400 outline-none"
              type="email"
              id="email"
              placeholder="Email"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-400 outline-none"
              type="password"
              id="password"
              placeholder="Password"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-400 outline-none"
              type="password"
              id="confirmPassword"
              placeholder="Confirm Password"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full p-2 rounded bg-blue-600 mt-4 text-white font-semibold hover:bg-blue-700 transition"
          >
            Register
          </button>

          {/* Already have account? */}
          <p className="text-center mt-4 text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Login Here
            </Link>
          </p>
        </fieldset>
      </form>
    </div>
  );
}
