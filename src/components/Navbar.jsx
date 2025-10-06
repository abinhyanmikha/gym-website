"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <div className="w-full flex justify-between px-10 h-20 items-center fixed text-2xl position-sticky bg-white z-10">
      <Link href="/" className="flex gap-2 items-center">
        <span className="font-bold">Home</span>
      </Link>
      <Link href="/AboutUs" className="flex gap-2 items-center">
        <span className="font-bold">About Us</span>
      </Link>
      <Link href="/Services" className="flex gap-2 items-center">
        <span className="font-bold">Services</span>
      </Link>
      <Link href="/Membership-Plans" className="flex gap-2 items-center">
        <span className="font-bold">Membership Plans</span>
      </Link>
      <Link href="/" className="flex gap-2 items-center">
        <span className="font-bold">Gallery</span>
      </Link>
      <Link href="/Reviews" className="flex gap-2 items-center">
        <span className="font-bold">Reviews</span>
      </Link>
      <Link href="/More" className="flex gap-2 items-center">
        <span className="font-bold">More</span>
      </Link>
      <Link href="/ContactUs" className="flex gap-2 items-center">
        <button className="font-bold border-2 border-gray-950 bg-blue-500 rounded-2xl px-4 py-2">
          Contact Us
        </button>
      </Link>
      
      {/* Authentication Section */}
      <div className="flex gap-4 items-center">
        {status === "loading" ? (
          <span className="text-sm">Loading...</span>
        ) : session ? (
          <div className="flex gap-2 items-center">
            <Link href="/dashboard" className="text-sm font-medium text-green-600 hover:text-green-700">
              Welcome, {session.user.name}
            </Link>
            <button
              onClick={() => signOut()}
              className="text-sm font-medium bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link href="/login" className="text-sm font-medium bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
              Login
            </Link>
            <Link href="/register" className="text-sm font-medium border border-green-500 text-green-500 px-3 py-1 rounded hover:bg-green-50">
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
