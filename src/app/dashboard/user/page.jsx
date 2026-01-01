import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import { connectDB } from "@/lib/mongodb";
import UserSubscription from "@/models/UserSubscription";
import Payment from "@/models/Payment";
import StatCard from "@/components/dashboard/StatCard";
import DataTable from "@/components/dashboard/DataTable";
import DashboardSection from "@/components/dashboard/DashboardSection";

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
    status: "active",
  })
    .sort({ startDate: -1 })
    .lean();

  // Fetch payment history
  const paymentHistory = await Payment.find({
    userId: session.user.id,
  })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Dashboard</h1>
        <LogoutButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <StatCard 
          title="Profile Information" 
          value={
            <div className="grid grid-cols-1 gap-1">
              <p className="text-sm text-gray-500">Name: <span className="text-gray-800 font-medium">{session.user.name}</span></p>
              <p className="text-sm text-gray-500">Email: <span className="text-gray-800 font-medium">{session.user.email}</span></p>
            </div>
          } 
          bgColor="bg-blue-50" 
        />
        
        <StatCard 
          title="My Subscription" 
          value={
            activeSubscription ? (
              <div className="text-sm">
                <p className="font-bold text-green-700">{activeSubscription.plan}</p>
                <p className="text-gray-600">Rs. {activeSubscription.amount}</p>
                <p className="text-xs text-gray-500">End: {new Date(activeSubscription.endDate).toLocaleDateString()}</p>
              </div>
            ) : (
              <div className="text-sm">
                <p className="text-gray-500 mb-2">No active subscription</p>
                <a href="/Membership-Plans" className="text-blue-600 hover:underline">View Plans</a>
              </div>
            )
          } 
          bgColor="bg-green-50" 
        />
      </div>

      <DashboardSection title="Payment History">
        <DataTable
          headers={[
            { label: "Description" },
            { label: "Date" },
            { label: "Amount" },
            { label: "Status", align: "right" },
          ]}
          data={paymentHistory || []}
          renderRow={(payment) => (
            <tr key={payment._id.toString()}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {payment.description || "Subscription Payment"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(payment.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                Rs. {payment.amount}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  payment.status === "success" ? "bg-green-100 text-green-800" : 
                  payment.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
                }`}>
                  {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                </span>
              </td>
            </tr>
          )}
        />
      </DashboardSection>

      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: "Home", href: "/", desc: "Return to homepage" },
            { label: "Membership Plans", href: "/Membership-Plans", desc: "View available plans" },
            { label: "About Us", href: "/AboutUs", desc: "Learn more about us" },
          ].map((link) => (
            <a key={link.href} href={link.href} className="bg-gray-100 p-4 rounded-lg shadow hover:bg-gray-200 transition-colors">
              <h3 className="font-medium">{link.label}</h3>
              <p className="text-sm text-gray-500">{link.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
