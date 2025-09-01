"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Checkout() {
  const searchParams = useSearchParams();
  const planName = searchParams.get("plan");

  const [plan, setPlan] = useState(null);
  const [txnId, setTxnId] = useState("");
  const [signature, setSignature] = useState("");

  useEffect(() => {
    async function setup() {
      // 1) Get plan
      const res = await fetch("/api/subscription");
      const plans = await res.json();
      const selected = plans.find((p) => p.name === planName);
      if (!selected) return;
      // ensure price is a number (no commas)
      const price = Number(String(selected.price).replace(/,/g, ""));
      setPlan({ ...selected, price });

      // 2) Make a unique transaction id
      const id = `txn_${Date.now()}`;
      setTxnId(id);

      // 3) Ask server for signature of ONLY the 3 fields
      const sigRes = await fetch("/api/esewa/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          total_amount: price,
          transaction_uuid: id,
          product_code: "EPAYTEST",
        }),
      });

      if (!sigRes.ok) {
        console.error("Failed to fetch signature");
        return;
      }
      const { signature } = await sigRes.json();
      setSignature(signature);
    }

    if (planName) setup();
  }, [planName]);

  if (!plan || !txnId || !signature) return <div>Loading...</div>;

  return (
    <form
      action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
      method="POST"
    >
      {/* Required by eSewa */}
      <input type="hidden" name="amount" value={plan.price} />
      <input type="hidden" name="tax_amount" value="0" />
      <input type="hidden" name="product_service_charge" value="0" />
      <input type="hidden" name="product_delivery_charge" value="0" />

      <input type="hidden" name="total_amount" value={plan.price} />
      <input type="hidden" name="transaction_uuid" value={txnId} />
      <input type="hidden" name="product_code" value="EPAYTEST" />

      {/* Signed fields MUST match the server signing string */}
      <input
        type="hidden"
        name="signed_field_names"
        value="total_amount,transaction_uuid,product_code"
      />
      <input type="hidden" name="signature" value={signature} />

      {/* Redirect URLs */}
      <input
        type="hidden"
        name="success_url"
        value={`http://localhost:3000/payment-success?amt=${plan.price}&pid=${txnId}&rid=EPAYTEST`}
      />
      <input
        type="hidden"
        name="failure_url"
        value="http://localhost:3000/payment-failure"
      />

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition"
      >
        Pay with eSewa
      </button>
    </form>
  );
}
