"use client";

import { useState } from "react";
import Link from "next/link";

export default function Register() {
  const [errors, setErrors] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    let validationErrors = [];

    // ✅ Check empty fields
    if (!name || !email || !password || !confirmPassword) {
      validationErrors.push("All fields are required.");
    }

    // ✅ Email format check
    if (!email.includes("@")) {
      validationErrors.push("Please enter a valid email address.");
    }

    // ✅ Password: at least 8 characters and 1 special character
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(password)) {
      validationErrors.push(
        "Password must be at least 8 characters long and contain at least one special character."
      );
    }

    // ✅ Password match check
    if (password !== confirmPassword) {
      validationErrors.push("Passwords do not match.");
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // ✅ If no errors → clear and submit
    setErrors([]);
    console.log({ name, email, password });
    alert("🎉 Registration successful!");
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

          {/* Show Errors */}
          {errors.length > 0 && (
            <div className="mb-4 p-3 bg-red-100 text-red-600 rounded">
              <ul className="list-disc list-inside">
                {errors.map((err, index) => (
                  <li key={index}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block mb-2" htmlFor="name">
              Name
            </label>
            <input
              className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-400 outline-none"
              type="text"
              id="name"
              name="name"
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
              name="email"
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
              name="password"
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
              name="confirmPassword"
              placeholder="Confirm Password"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full p-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
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
