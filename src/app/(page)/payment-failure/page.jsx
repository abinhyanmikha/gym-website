"use client";
import Link from "next/link";

export default function PaymentFailure() {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-red-100 px-4">
      <h1 className="text-3xl font-bold text-red-800 mb-4">Payment Failed!</h1>
      <p className="text-lg text-red-700 mb-6 text-center">
        Unfortunately, your payment could not be processed. Please try again or
        contact support if the issue persists.
      </p>

      <Link
        href="/"
        className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        Go to Home
      </Link>
    </div>
  );
}
