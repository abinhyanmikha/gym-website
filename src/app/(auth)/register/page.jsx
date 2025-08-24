"use client";

import Link from "next/link";

export default function Register() {
  return (
    <div className=" w-full h-screen flex justify-center items-center border-gray-950 rounded-2xl  ">
      <form className="flex flex-col gap-4 w-full max-w-md p-6 bg-white rounded-lg">
        <fieldset>
          <legend className="text-2xl font-bold mb-2 text-center">
            Register
          </legend>
          <p className="mb-4 text-center">
            Please fill up this registration form
          </p>

          <div>
            <label className="block mb-2" htmlFor="name">
              Name
            </label>
            <input
              className="border border-gray-300 p-2 rounded w-full"
              type="text"
              id="name"
              placeholder="UserName"
              required
            />
          </div>
          <div>
            <label className="block mb-2" htmlFor="Email">
              Email
            </label>
            <input
              className="border border-gray-300 p-2 rounded w-full"
              type="email"
              id="Email"
              placeholder="Email"
              required
            />
          </div>
          <div>
            <label className="block mb-2" htmlFor="Password">
              Password
            </label>
            <input
              className="border border-gray-300 p-2 rounded w-full"
              type="password"
              id="password"
              placeholder="Password"
              required
            />
          </div>
          <div>
            <label className="block mb-2" htmlFor="ConfirmPassword">
              Confirm Password
            </label>
            <input
              className="border border-gray-300 p-2 rounded w-full"
              type="password"
              id="ConfirmPassword"
              placeholder="ConfirmPassword"
              required
            />
          </div>
          <Link
            href="/login"
            className=" p-2 rounded w-full text-center bg-blue-500 text-white hover:bg-blue-600"
          >
            Login Here
          </Link>
        </fieldset>
      </form>
    </div>
  );
}
