"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="w-full bg-white shadow-lg fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2"
            onClick={closeMenu}
          >
            <Image
              src="/logo.jpg"
              alt="Ajima Physical Fitness Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="font-bold text-xl text-gray-800 hidden sm:block">
              AJIMA FITNESS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/AboutUs"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/Membership-Plans"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Membership
            </Link>
            <Link
              href="/Reviews"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Reviews
            </Link>
            <Link
              href="/ContactUs"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Contact Us
            </Link>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {status === "loading" ? (
              <span className="text-sm text-gray-600">Loading...</span>
            ) : session ? (
              <div className="flex items-center space-x-3">
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
                >
                  Welcome, {session.user?.name || "User"}
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-sm font-medium bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link
                  href="/login"
                  className="text-sm font-medium bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium border border-green-500 text-green-500 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button & Auth */}
          <div className="md:hidden flex items-center space-x-4">
            {status === "loading" ? (
              <span className="text-xs text-gray-600">Loading...</span>
            ) : session ? (
              <div className="flex items-center space-x-2">
                <Link
                  href="/dashboard"
                  className="text-xs font-medium text-green-600"
                  onClick={closeMenu}
                >
                  {session.user?.name || "Profile"}
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    closeMenu();
                  }}
                  className="text-xs font-medium bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-xs font-medium bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                onClick={closeMenu}
              >
                Login
              </Link>
            )}

            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              <Link
                href="/"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md font-medium"
                onClick={closeMenu}
              >
                Home
              </Link>
              <Link
                href="/AboutUs"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md font-medium"
                onClick={closeMenu}
              >
                About Us
              </Link>
              <Link
                href="/Membership-Plans"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md font-medium"
                onClick={closeMenu}
              >
                Membership Plans
              </Link>
              <Link
                href="/Reviews"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md font-medium"
                onClick={closeMenu}
              >
                Reviews
              </Link>
              <Link
                href="/ContactUs"
                className="block px-3 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 text-center"
                onClick={closeMenu}
              >
                Contact Us
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
