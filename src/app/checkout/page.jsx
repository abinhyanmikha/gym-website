"use client";
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";

export default function Checkout({ planId }) {
  const { data: session } = useSession();
  const [plan, setPlan] = useState(null);
  const [txnId, setTxnId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function setup() {
      if (!session) {
        alert("You must be logged in to checkout.");
        signIn();
        return;
      }

      try {
        // 1️⃣ Fetch plan info
        const res = await fetch("/api/subscription");
        const plans = await res.json();
        const selected = plans.find((p) => p._id === planId);
        if (!selected) return alert("Plan not found");

        setPlan(selected);

        // 2️⃣ Generate transaction ID
        const transaction_uuid = `txn_${Date.now()}`;
        setTxnId(transaction_uuid);

        // 3️⃣ Store pending payment in DB
        await fetch("/api/payment/store", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: session.user.id,
            subscriptionId: selected._id,
            subscriptionName: selected.name,
            amount: selected.price,
            transactionId: transaction_uuid,
            status: "pending",
          }),
        });

        setLoading(false);
      } catch (err) {
        console.error("Checkout setup failed:", err);
        alert("Failed to setup checkout.");
      }
    }

    if (planId) setup();
  }, [planId, session]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!plan) return <div className="text-center mt-10">Plan not found.</div>;

  return (
    <form
      action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
      method="POST"
    >
      <input type="hidden" name="amt" value={plan.price} />
      <input type="hidden" name="pid" value={txnId} />
      <input type="hidden" name="scd" value="EPAYTEST" />
      <input
        type="hidden"
        name="su"
        value={`http://localhost:3000/payment-success?subscriptionId=${plan._id}&userId=${session.user.id}&subscriptionName=${plan.name}&amt=${plan.price}&pid=${txnId}`}
      />
      <input
        type="hidden"
        name="fu"
        value={`http://localhost:3000/payment-failure?subscriptionId=${plan._id}&userId=${session.user.id}&subscriptionName=${plan.name}&amt=${plan.price}&pid=${txnId}`}
      />

      <button
        type="submit"
        className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
      >
        Pay with eSewa
      </button>
    </form>
  );
}
