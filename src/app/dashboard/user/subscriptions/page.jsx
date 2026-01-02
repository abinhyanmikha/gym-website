import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import UserSubscription from "@/models/UserSubscription";
import { updateExpiredSubscriptions } from "@/lib/subscriptions";

export default async function UserSubscriptionsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Admin users should be redirected to admin dashboard
  if (session.user.role === "admin") {
    redirect("/dashboard/admin");
  }

  await connectDB();

  // Update any expired subscriptions for this session
  await updateExpiredSubscriptions();

  const allSubscriptions = await UserSubscription.find({
    userId: session.user.id,
  })
    .sort({ startDate: -1 })
    .lean();

  const now = new Date();
  
  // Categorize subscriptions
  // A subscription is "truly active" if its status is 'active' AND it hasn't passed its end date
  const currentSubscription = allSubscriptions.find(s => 
    s.status === "active" && s.endDate && new Date(s.endDate) > now
  );

  // If we didn't find a 'truly active' one, maybe there's one that just expired but hasn't been updated in DB yet
  const recentlyExpired = !currentSubscription ? allSubscriptions.find(s => 
    s.status === "active" && s.endDate && new Date(s.endDate) <= now
  ) : null;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Subscriptions</h1>
      
      <div className="mb-6">
        <div className="bg-green-50 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Current Subscription</h2>
          <div className="p-4 bg-white rounded border border-gray-200">
            {currentSubscription ? (
              <div>
                <div className="mb-4">
                  <h3 className="font-bold text-lg text-green-700">
                    {currentSubscription.plan}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Amount: Rs.{" "}
                    {Number(currentSubscription.amount || 0).toLocaleString()}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Start Date</p>
                    <p className="font-medium">
                      {new Date(currentSubscription.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">End Date</p>
                    <p className="font-medium">
                      {currentSubscription.endDate
                        ? new Date(currentSubscription.endDate).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>
                </div>
                <div className="bg-green-100 p-2 rounded">
                  <p className="text-sm text-green-700">
                    <span className="font-medium">Status: </span>
                    <span className="font-bold">Active</span>
                  </p>
                </div>
              </div>
            ) : recentlyExpired ? (
              <div>
                <div className="mb-4 opacity-75">
                  <h3 className="font-bold text-lg text-gray-700">
                    {recentlyExpired.plan} (Expired)
                  </h3>
                  <p className="text-sm text-gray-600">
                    End Date: {recentlyExpired.endDate ? new Date(recentlyExpired.endDate).toLocaleDateString() : "-"}
                  </p>
                </div>
                <div className="bg-red-50 p-2 rounded border border-red-100">
                  <p className="text-sm text-red-700">
                    Your subscription has expired. Please renew.
                  </p>
                </div>
                <a
                  href="/Membership-Plans"
                  className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Renew Subscription
                </a>
              </div>
            ) : (
              <div className="py-2">
                <p className="text-gray-500 mb-4">
                  You don't have an active subscription
                </p>
                <a
                  href="/Membership-Plans"
                  className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                >
                  View Membership Plans
                </a>
              </div>
            )}
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
              {allSubscriptions.length > 0 ? (
                allSubscriptions.map((s) => {
                  const isExpiredStatus = s.status === "expired" || (s.status === "active" && s.endDate && new Date(s.endDate) <= now);
                  const displayStatus = isExpiredStatus ? "Expired" : (s.status.charAt(0).toUpperCase() + s.status.slice(1));
                  
                  return (
                    <tr key={s._id?.toString?.() || s._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {s.plan}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Rs. {Number(s.amount || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {s.startDate ? new Date(s.startDate).toLocaleDateString() : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {s.endDate ? new Date(s.endDate).toLocaleDateString() : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            displayStatus === "Active"
                              ? "bg-green-100 text-green-800"
                              : displayStatus === "Expired"
                              ? "bg-gray-100 text-gray-800"
                              : displayStatus === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {displayStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    colSpan="5"
                  >
                    No subscription history found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
