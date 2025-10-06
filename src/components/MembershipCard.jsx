// src/components/MembershipCard.jsx
"use client";

import { useSession, signIn } from "next-auth/react";
import React from "react";

export default function MembershipCard({
  subscriptionId,
  title,
  features,
  price,
  color,
  duration,
  includesCardio,
}) {
  const { data: session } = useSession();

  const handleEsewaPay = async () => {
    if (!session) {
      alert("⚠️ You must be logged in to purchase a plan.");
      signIn();
      return;
    }

    try {
      const transaction_uuid = Date.now().toString();
      const total_amount = price;
      const product_code = "EPAYTEST";

      // 1️⃣ Store pending payment
      await fetch("/api/payment/store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          subscriptionId,
          subscriptionName: title,
          amount: total_amount,
          transactionId: transaction_uuid,
          status: "pending",
        }),
      });

      // 2️⃣ Get eSewa signature
      const res = await fetch("/api/esewa/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          total_amount,
          transaction_uuid,
          product_code,
          userId: session.user.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to sign request");

      // 3️⃣ Submit eSewa form
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

      const fields = {
        amount: total_amount,
        tax_amount: 0,
        total_amount,
        transaction_uuid,
        product_code,
        product_service_charge: 0,
        product_delivery_charge: 0,
        success_url: `http://localhost:3000/payment-success?subscriptionId=${subscriptionId}&userId=${session.user.id}&subscriptionName=${title}&amt=${total_amount}&pid=${transaction_uuid}`,
        failure_url: `http://localhost:3000/payment-failure?subscriptionId=${subscriptionId}&userId=${session.user.id}&subscriptionName=${title}&amt=${total_amount}&pid=${transaction_uuid}`,
        signed_field_names: data.signed_field_names,
        signature: data.signature,
      };

      Object.entries(fields).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      alert("Esewa init failed: " + err.message);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-t-4 ${color}`}>
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-2xl font-semibold mb-1">Rs. {price}</p>
      <p className="text-gray-600 mb-2">{duration}</p>

      {includesCardio && (
        <span className="inline-block bg-green-200 text-green-800 px-2 py-1 text-xs rounded mb-2">
          Cardio Included
        </span>
      )}

      <ul className="mt-4 text-sm text-gray-700 list-disc list-inside">
        {Array.isArray(features) && features.length > 0 ? (
          features.map((f, idx) => <li key={idx}>{f}</li>)
        ) : (
          <li>No features available</li>
        )}
      </ul>

      <button
        onClick={handleEsewaPay}
        className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
      >
        Choose Plan
      </button>
    </div>
  );
}
