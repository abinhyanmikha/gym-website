"use client";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    async function verifyPayment() {
      try {
        // Read actual eSewa redirect parameters
        const amt = searchParams.get("amt"); // total amount
        const pid = searchParams.get("pid"); // transaction id
        const rid = searchParams.get("rid"); // product code

        if (!amt || !pid || !rid) {
          console.error("Missing payment parameters from eSewa");
          alert("Payment parameters missing. Cannot verify.");
          return;
        }

        // Send these values to your backend for verification
        const res = await fetch("/api/esewa/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transaction_uuid: pid,
            total_amount: amt,
            product_code: rid,
          }),
        });

        let data;
        try {
          data = await res.json();
        } catch (err) {
          const text = await res.text();
          console.error("Invalid JSON from /api/esewa/verify:", text);
          alert("Payment verification failed: invalid response from server.");
          return;
        }

        if (res.ok) {
          alert("Payment verified! Subscription is active.");
          router.push("/dashboard");
        } else {
          alert(
            "Payment verification failed: " + (data.message || "Unknown error")
          );
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        alert("Payment verification failed due to network or server error.");
      }
    }

    verifyPayment();
  }, [searchParams, router]);

  return <div>Verifying payment...</div>;
}
