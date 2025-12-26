"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

function PaymentSuccessInner() {
  const searchParams = useSearchParams();
  const refId = searchParams.get("pid"); // Changed from refId to pid to match what's being passed
  const amount = searchParams.get("amt"); // Changed from amount to amt to match what's being passed
  const subscriptionName = searchParams.get("subscriptionName");
  const subscriptionId = searchParams.get("subscriptionId");

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "authenticated") {
      console.log("User not authenticated yet");
      return;
    }

    if (!refId) {
      console.log("Missing refId/pid parameter");
      return;
    }

    console.log("Payment success parameters:", {
      pid: refId,
      amt: amount,
      subscriptionName,
      subscriptionId,
      userId: session?.user?.id,
    });

    const verifyPayment = async () => {
      try {
        // Convert amount to number if it's a string
        const amountValue = amount ? parseFloat(amount) : 0;

        console.log("Sending verification request with:", {
          amount: amountValue,
          refId,
          userId: session.user.id,
          subscriptionName,
          subscriptionId,
        });

        const res = await fetch("/api/esewa/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: amountValue, // Ensure amount is a number
            refId,
            userId: session.user.id,
            subscriptionName: subscriptionName || "Basic Plan", // Provide fallback
            subscriptionId: subscriptionId || "basic", // Provide fallback
          }),
        });

        if (!res.ok) {
          console.error("Verification request failed with status:", res.status);
          const errorText = await res.text();
          console.error("Error response:", errorText);
          return;
        }

        const data = await res.json();
        console.log("Payment verification result:", data);

        if (data.success) {
          console.log("Payment verified successfully!");
        } else {
          console.error("Payment verification failed:", data.error);
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
      }
    };

    verifyPayment();
  }, [status, session, refId, amount, subscriptionName, subscriptionId]);

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-green-100 px-4">
      <h1 className="text-3xl font-bold text-green-800 mb-4">
        Payment Successful!
      </h1>
      <p className="text-lg text-green-700 mb-6 text-center">
        Thank you for your payment. Your subscription has been activated.
      </p>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Payment Details
        </h2>
        <div className="space-y-2">
          <p>
            <span className="font-medium">Plan:</span>{" "}
            {subscriptionName || "N/A"}
          </p>
          <p>
            <span className="font-medium">Amount:</span> Rs. {amount || "0"}
          </p>
          <p>
            <span className="font-medium">Transaction ID:</span>{" "}
            {refId || "N/A"}
          </p>
          <p>
            <span className="font-medium">Status:</span>{" "}
            <span className="text-green-600 font-semibold">Success</span>
          </p>
        </div>
      </div>
      <a
        href="/dashboard"
        className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        Go to Dashboard
      </a>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={null}>
      <PaymentSuccessInner />
    </Suspense>
  );
}
