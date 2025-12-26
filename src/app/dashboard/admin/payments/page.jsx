"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function AdminPaymentsPage() {
  const { data: session, status } = useSession();
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
    if (status === "authenticated" && session?.user?.role !== "admin") {
      redirect("/dashboard/user");
    }
  }, [status, session]);

  useEffect(() => {
    if (status !== "authenticated" || session?.user?.role !== "admin") return;

    fetch("/api/admin/payments")
      .then((res) => res.json())
      .then((data) =>
        setPayments(Array.isArray(data) ? data : data.payments || [])
      )
      .catch((err) => {
        console.error(err);
        setError("Failed to load payments");
      });
  }, [status, session]);

  const normalize = (value) => (value ?? "").toString().toLowerCase();

  const visiblePayments = useMemo(() => {
    if (!searchTerm.trim()) return payments;
    const q = normalize(searchTerm.trim());
    return payments.filter((p) => {
      const planText = [
        p?.plan?.name,
        p?.plan?.duration,
        p?.plan?.price,
        p?.subscriptionName,
        p?.subscriptionId,
        p?.refId,
      ]
        .filter(Boolean)
        .join(" ");

      return (
        normalize(p?.user?.name).includes(q) ||
        normalize(p?.user?.email).includes(q) ||
        normalize(planText).includes(q)
      );
    });
  }, [payments, searchTerm]);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Payment Management
      </h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search payments by user, plan, or transaction..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-gray-50 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {visiblePayments.length > 0 ? (
              visiblePayments.map((payment) => (
                <tr key={payment._id || payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {payment.user?.name || "Unknown"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {payment.user?.email || "No email"}
                    </div>
                    <div className="text-xs text-gray-400">
                      {payment.refId
                        ? `Txn: ${payment.refId}`
                        : "No transaction ID"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {payment.plan?.name ||
                        payment.subscriptionName ||
                        "Unknown Plan"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {payment.plan
                        ? `Rs. ${Number(
                            payment.plan.price || 0
                          ).toLocaleString()} • ${payment.plan.duration} days`
                        : payment.subscriptionId
                        ? `Plan ID: ${payment.subscriptionId}`
                        : "Plan not found"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      Rs. {Number(payment.amount || 0).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        payment.status === "success"
                          ? "bg-green-100 text-green-800"
                          : payment.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {payment.status || "unknown"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(
                        payment.createdAt || Date.now()
                      ).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  colSpan="5"
                >
                  No payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
