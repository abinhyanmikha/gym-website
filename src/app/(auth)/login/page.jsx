"use client";
import Link from "next/link";
export default function Login() {
  return (
    <div>
      <div className="w-full h-screen flex justify-center items-center border-gray-950 rounded-2xl">
        <form>
          <fieldset>
            <legend className="text-2xl font-bold mb-2 text-center">
              Login
            </legend>

            <label htmlFor="email" className="block mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              className="border border-gray-300 p-2 rounded w-full"
            />
            <label htmlFor="email" className="block mb-2">
              password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="password here"
              className="border border-gray-300 p-2 rounded w-full"
            />
            <Link href="/dashboard">Login</Link>
          </fieldset>
        </form>
      </div>
      <Link href="/register">Register Here</Link>
    </div>
  );
}
