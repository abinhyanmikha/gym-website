"use client";

import LogoutButton from "@/components/LogoutButton";
import UserModal from "@/components/admin/UserModal";
import SubscriptionModal from "@/components/admin/SubscriptionModal";
import StatCard from "@/components/dashboard/StatCard";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { UsersTab, SubscriptionsTab, PaymentsTab, TrainersTab } from "@/components/admin/DashboardTabs";

export default function AdminDashboardPage() {
  const d = useAdminDashboard(); // Dashboard hook

  if (d.loading && d.activeTab === "overview" && !d.stats.totalUsers) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <LogoutButton />
      </div>

      {d.activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-6 mb-6">
          <StatCard title="Total Users" value={d.stats.totalUsers ?? 0} bgColor="bg-blue-100" />
          <StatCard title="Active Subscriptions" value={d.stats.activeSubscriptions ?? 0} bgColor="bg-green-100" />
          <StatCard title="Daily Revenue" value={`Rs. ${Number(d.stats.dailyRevenue || 0).toLocaleString()}`} bgColor="bg-yellow-100" />
          <StatCard title="Monthly Revenue" value={`Rs. ${Number(d.stats.monthlyRevenue || 0).toLocaleString()}`} bgColor="bg-orange-100" />
          <StatCard title="Yearly Revenue" value={`Rs. ${Number(d.stats.yearlyRevenue || 0).toLocaleString()}`} bgColor="bg-indigo-100" />
          <StatCard title="Total Revenue" value={`Rs. ${Number(d.stats.totalRevenue || 0).toLocaleString()}`} bgColor="bg-purple-100" />
        </div>
      )}

      {d.error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{d.error}</div>}
      {d.loading && d.activeTab !== "overview" && <div className="text-center py-4">Loading data...</div>}

      <div className={d.loading ? "opacity-50 pointer-events-none" : ""}>
        {(d.activeTab === "overview" || d.activeTab === "users") && (
          <UsersTab {...d} />
        )}

        {d.activeTab === "subscriptions" && (
          <SubscriptionsTab {...d} />
        )}

        {d.activeTab === "payments" && (
          <PaymentsTab {...d} />
        )}

        {d.activeTab === "trainers" && (
          <TrainersTab {...d} />
        )}
      </div>

      <UserModal
        isOpen={d.userModalOpen}
        onClose={() => d.setUserModalOpen(false)}
        user={d.selectedUser}
        onSave={d.handleSaveUser}
      />

      <SubscriptionModal
        isOpen={d.subscriptionModalOpen}
        onClose={() => d.setSubscriptionModalOpen(false)}
        subscription={d.selectedSubscription}
        onSave={d.handleSaveSubscription}
      />
    </div>
  );
}
