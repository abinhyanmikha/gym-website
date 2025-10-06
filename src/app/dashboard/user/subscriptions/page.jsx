import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function UserSubscriptionsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Admin users should be redirected to admin dashboard
  if (session.user.role === "admin") {
    redirect("/dashboard/admin");
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Subscriptions</h1>
      
      <div className="mb-6">
        <div className="bg-green-50 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Current Subscription</h2>
          <div className="p-4 bg-white rounded border border-gray-200">
            <p className="text-gray-500 mb-2">You don't have an active subscription</p>
            <a href="/Membership-Plans" className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
              View Plans
            </a>
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Subscription History</h2>
        <div className="bg-gray-50 rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colSpan="5">No subscription history found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}