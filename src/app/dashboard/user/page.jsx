import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import { connectDB } from "@/lib/mongodb";
import UserSubscription from "@/models/UserSubscription";
import Payment from "@/models/Payment";

export default async function UserDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Admin users should be redirected to admin dashboard
  if (session.user.role === "admin") {
    redirect("/dashboard/admin");
  }
  
  // Connect to database
  await connectDB();
  
  // Fetch user's active subscription
  const activeSubscription = await UserSubscription.findOne({
    userId: session.user.id,
    status: "active"
  }).sort({ startDate: -1 }).lean();
  
  // Fetch payment history
  const paymentHistory = await Payment.find({
    userId: session.user.id
  }).sort({ createdAt: -1 }).limit(5).lean();

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Dashboard</h1>
        <LogoutButton />
      </div>
      
      <div className="mb-6">
        <div className="bg-blue-50 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Profile Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{session.user.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{session.user.email}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-green-50 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">My Subscription</h2>
          <div className="p-4 bg-white rounded border border-gray-200">
            {activeSubscription ? (
              <div>
                <div className="mb-4">
                  <h3 className="font-bold text-lg text-green-700">{activeSubscription.plan}</h3>
                  <p className="text-sm text-gray-600">Amount: Rs. {activeSubscription.amount}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Start Date</p>
                    <p className="font-medium">{new Date(activeSubscription.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">End Date</p>
                    <p className="font-medium">{new Date(activeSubscription.endDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="bg-green-100 p-2 rounded">
                  <p className="text-sm">
                    <span className="font-medium">Status: </span>
                    <span className="text-green-700 font-bold">Active</span>
                  </p>
                </div>
              </div>
            ) : (
              <>
                <p className="text-gray-500 mb-2">You don't have an active subscription</p>
                <a href="/Membership-Plans" className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
                  View Plans
                </a>
              </>
            )}
          </div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Payment History</h2>
          <div className="p-4 bg-white rounded border border-gray-200">
            {paymentHistory && paymentHistory.length > 0 ? (
              <div className="space-y-3">
                {paymentHistory.map((payment) => (
                  <div key={payment._id} className="border-b pb-2 last:border-b-0">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{payment.description || 'Subscription Payment'}</p>
                        <p className="text-xs text-gray-500">{new Date(payment.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">Rs. {payment.amount}</p>
                        <p className={`text-xs ${payment.status === 'success' ? 'text-green-600' : payment.status === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No payment history found</p>
            )}
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <a href="/" className="bg-gray-100 p-4 rounded-lg shadow hover:bg-gray-200 transition-colors">
            <h3 className="font-medium">Home</h3>
            <p className="text-sm text-gray-500">Return to homepage</p>
          </a>
          <a href="/Membership-Plans" className="bg-gray-100 p-4 rounded-lg shadow hover:bg-gray-200 transition-colors">
            <h3 className="font-medium">Membership Plans</h3>
            <p className="text-sm text-gray-500">View available plans</p>
          </a>
          <a href="/AboutUs" className="bg-gray-100 p-4 rounded-lg shadow hover:bg-gray-200 transition-colors">
            <h3 className="font-medium">About Us</h3>
            <p className="text-sm text-gray-500">Learn more about us</p>
          </a>
        </div>
      </div>
    </div>
  );
}
