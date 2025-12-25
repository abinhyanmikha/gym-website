"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";

function PaymentFailureInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    async function storeFailedPayment() {
      const subscriptionId = searchParams.get("subscriptionId");
      const userId = searchParams.get("userId");
      const subscriptionName = searchParams.get("subscriptionName");
      const amt = searchParams.get("amt");
      const pid = searchParams.get("pid");

      if (!subscriptionId || !userId || !pid) return;

      try {
        await fetch("/api/payment/store", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            subscriptionId,
            subscriptionName,
            amount: Number(amt),
            transactionId: pid,
            status: "failed",
          }),
        });
      } catch (err) {
        console.error("Failed to store failed payment:", err);
      }
    }

    storeFailedPayment();
  }, [searchParams]);

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-red-100 px-4">
      <h1 className="text-3xl font-bold text-red-800 mb-4">Payment Failed!</h1>
      <p className="text-lg text-red-700 mb-6 text-center">
        Unfortunately, your payment could not be processed. Please try again or
        contact support.
      </p>
      <button
        onClick={() => router.push("/membership-plans")}
        className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        Go Back to Plans
      </button>
    </div>
  );
}

export default function PaymentFailure() {
  return (
    <Suspense
      fallback={
        <div className="w-screen h-screen flex justify-center items-center bg-red-100 px-4">
          Loading...
        </div>
      }
    >
      <PaymentFailureInner />
    </Suspense>
  );
}
