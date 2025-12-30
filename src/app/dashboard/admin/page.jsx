"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import LogoutButton from "@/components/LogoutButton";
import UserModal from "@/components/admin/UserModal";
import SubscriptionModal from "@/components/admin/SubscriptionModal";

const ALLOWED_TABS = [
  "overview",
  "users",
  "subscriptions",
  "payments",
  "trainers",
];

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    dailyRevenue: 0,
    monthlyRevenue: 0,
    yearlyRevenue: 0,
  });
  const [users, setUsers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [trainerName, setTrainerName] = useState("");
  const [trainerImageBase64, setTrainerImageBase64] = useState("");

  // Modal states
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  // Check authentication
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }

    if (status === "authenticated" && session?.user?.role !== "admin") {
      router.replace("/dashboard/user");
    }
  }, [status, session, router]);

  useEffect(() => {
    const nextTab = (tabParam || "overview").toLowerCase();
    if (!ALLOWED_TABS.includes(nextTab)) {
      router.replace("/dashboard/admin?tab=overview");
      if (activeTab !== "overview") {
        setActiveTab("overview");
        setSearchTerm("");
      }
      return;
    }

    if (nextTab !== activeTab) {
      setActiveTab(nextTab);
      setSearchTerm("");
    }
  }, [tabParam, router, activeTab]);

  const normalize = (value) => (value ?? "").toString().toLowerCase();

  const visibleUsers =
    activeTab === "users" && searchTerm.trim()
      ? users.filter((u) => {
          const q = normalize(searchTerm.trim());
          return (
            normalize(u?.name).includes(q) || normalize(u?.email).includes(q)
          );
        })
      : users;

  const visibleSubscriptions = searchTerm.trim()
    ? subscriptions.filter((p) => {
        const q = normalize(searchTerm.trim());
        const featuresText = Array.isArray(p?.features)
          ? p.features.join(" ")
          : "";
        return (
          normalize(p?.name).includes(q) || normalize(featuresText).includes(q)
        );
      })
    : subscriptions;

  const visiblePayments = searchTerm.trim()
    ? payments.filter((p) => {
        const q = normalize(searchTerm.trim());
        const planText = [
          p?.plan?.name,
          p?.plan?.duration,
          p?.plan?.price,
          p?.subscriptionName,
          p?.subscriptionId,
        ]
          .filter(Boolean)
          .join(" ");
        return (
          normalize(p?.user?.name).includes(q) ||
          normalize(p?.user?.email).includes(q) ||
          normalize(planText).includes(q) ||
          normalize(p?.refId).includes(q)
        );
      })
    : payments;

  const handleTrainerImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setTrainerImageBase64(reader.result?.toString() || "");
    };
  };

  const resetTrainerForm = () => {
    setTrainerName("");
    setTrainerImageBase64("");
  };

  const saveTrainer = async () => {
    const trimmedName = trainerName.trim();
    if (!trimmedName) return alert("Trainer name is required");
    if (!trainerImageBase64) return alert("Trainer image is required");

    try {
      const res = await fetch("/api/trainers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          imageBase64: trainerImageBase64,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Trainer action failed");
        return;
      }

      setTrainers((prev) => [data.trainer, ...prev]);

      resetTrainerForm();
    } catch (err) {
      console.error("Error saving trainer:", err);
      setError("Failed to save trainer");
    }
  };

  // Fetch dashboard data
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "admin") {
      fetchDashboardData();
    }
  }, [status, session, activeTab]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch stats for overview
      const statsResponse = await fetch("/api/admin/stats");
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      } else {
        throw new Error("Failed to fetch stats");
      }

      // Fetch data based on active tab
      if (activeTab === "users" || activeTab === "overview") {
        const usersResponse = await fetch("/api/admin/users");
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          // Handle both old array format and new paginated format
          setUsers(
            Array.isArray(usersData) ? usersData : usersData.users || []
          );
        } else {
          throw new Error("Failed to fetch users");
        }
      }

      if (activeTab === "subscriptions" || activeTab === "overview") {
        const subscriptionsResponse = await fetch("/api/admin/subscriptions");
        if (subscriptionsResponse.ok) {
          const subscriptionsData = await subscriptionsResponse.json();
          // Handle both old array format and new paginated format
          setSubscriptions(
            Array.isArray(subscriptionsData)
              ? subscriptionsData
              : subscriptionsData.plans || []
          );
        } else {
          throw new Error("Failed to fetch subscriptions");
        }
      }

      if (activeTab === "payments" || activeTab === "overview") {
        const paymentsResponse = await fetch("/api/admin/payments");
        if (paymentsResponse.ok) {
          const paymentsData = await paymentsResponse.json();
          // Handle both old array format and new paginated format
          setPayments(
            Array.isArray(paymentsData)
              ? paymentsData
              : paymentsData.payments || []
          );
        } else {
          throw new Error("Failed to fetch payments");
        }
      }

      if (activeTab === "trainers") {
        const trainersResponse = await fetch("/api/trainers");
        if (trainersResponse.ok) {
          const trainersData = await trainersResponse.json();
          setTrainers(trainersData.trainers || []);
        } else {
          throw new Error("Failed to fetch trainers");
        }
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <LogoutButton />
      </div>

      {/* Stats Cards - Show only on overview */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-6 mb-6">
          <div className="bg-blue-100 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Total Users</h2>
            <p className="text-3xl font-bold">{stats.totalUsers ?? 0}</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Active Subscriptions</h2>
            <p className="text-3xl font-bold">
              {stats.activeSubscriptions ?? 0}
            </p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Daily Revenue</h2>
            <p className="text-3xl font-bold">
              Rs. {Number(stats.dailyRevenue || 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-orange-100 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Monthly Revenue</h2>
            <p className="text-3xl font-bold">
              Rs. {Number(stats.monthlyRevenue || 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-indigo-100 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Yearly Revenue</h2>
            <p className="text-3xl font-bold">
              Rs. {Number(stats.yearlyRevenue || 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Total Revenue</h2>
            <p className="text-3xl font-bold">
              Rs. {Number(stats.totalRevenue || 0).toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Loading and Error States */}
      {loading && <div className="text-center py-4">Loading data...</div>}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
      )}

      {/* Users Table - Show on overview or users tab */}
      {(activeTab === "overview" || activeTab === "users") && !loading && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Users</h2>
            {activeTab === "users" && (
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() => {
                  setSelectedUser(null);
                  setUserModalOpen(true);
                }}
              >
                Add New User
              </button>
            )}
          </div>
          {activeTab === "users" && (
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
          <div className="bg-gray-50 rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  {activeTab === "users" && (
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {visibleUsers.length > 0 ? (
                  visibleUsers.map((user) => (
                    <tr key={user._id || user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(
                          user.createdAt || Date.now()
                        ).toLocaleDateString()}
                      </td>
                      {activeTab === "users" && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                            onClick={() => {
                              setSelectedUser(user);
                              setUserModalOpen(true);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900"
                            onClick={async () => {
                              if (
                                confirm(
                                  "Are you sure you want to delete this user?"
                                )
                              ) {
                                try {
                                  const response = await fetch(
                                    `/api/admin/users/${user._id || user.id}`,
                                    {
                                      method: "DELETE",
                                    }
                                  );
                                  if (response.ok) {
                                    fetchDashboardData();
                                  } else {
                                    setError("Failed to delete user");
                                  }
                                } catch (err) {
                                  console.error("Error deleting user:", err);
                                  setError("Failed to delete user");
                                }
                              }
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={activeTab === "users" ? 5 : 4}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subscriptions Table - Show on subscriptions tab */}
      {activeTab === "subscriptions" && !loading && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Subscription Plans</h2>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => {
                setSelectedSubscription(null);
                setSubscriptionModalOpen(true);
              }}
            >
              Add New Plan
            </button>
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search subscription plans by name or features..."
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
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Features
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {visibleSubscriptions.length > 0 ? (
                  visibleSubscriptions.map((subscription) => (
                    <tr key={subscription._id || subscription.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {subscription.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          ${subscription.price}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {subscription.duration} days
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {subscription.features &&
                            subscription.features
                              .slice(0, 2)
                              .map((feature, index) => (
                                <div key={index}>{feature}</div>
                              ))}
                          {subscription.features &&
                            subscription.features.length > 2 && (
                              <div>
                                +{subscription.features.length - 2} more
                              </div>
                            )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                          onClick={() => {
                            setSelectedSubscription(subscription);
                            setSubscriptionModalOpen(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={async () => {
                            if (
                              confirm(
                                "Are you sure you want to delete this subscription plan?"
                              )
                            ) {
                              try {
                                const response = await fetch(
                                  `/api/admin/subscriptions/${
                                    subscription._id || subscription.id
                                  }`,
                                  {
                                    method: "DELETE",
                                  }
                                );
                                if (response.ok) {
                                  fetchDashboardData();
                                } else {
                                  setError(
                                    "Failed to delete subscription plan"
                                  );
                                }
                              } catch (err) {
                                console.error(
                                  "Error deleting subscription:",
                                  err
                                );
                                setError("Failed to delete subscription plan");
                              }
                            }
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No subscription plans found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payments Table - Show on payments tab */}
      {activeTab === "payments" && !loading && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Payment History</h2>
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search payments by user name or plan..."
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
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
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
                              ).toLocaleString()} • ${
                                payment.plan.duration
                              } days`
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
                        <div className="text-sm text-gray-500">
                          {new Date(
                            payment.createdAt || Date.now()
                          ).toLocaleDateString()}
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
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No payment history found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "trainers" && !loading && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Trainers</h2>
          </div>

          <div className="bg-gray-50 rounded-lg shadow p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Trainer Name
                </label>
                <input
                  type="text"
                  value={trainerName}
                  onChange={(e) => setTrainerName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter trainer name"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleTrainerImage}
                />
              </div>
            </div>

            {trainerImageBase64 && (
              <div className="mt-4 flex items-center gap-4">
                <Image
                  src={trainerImageBase64}
                  alt="Trainer preview"
                  width={64}
                  height={64}
                  className="rounded-full object-cover"
                />
                <div className="text-sm text-gray-600">New trainer</div>
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                onClick={saveTrainer}
              >
                Add Trainer
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {trainers.length > 0 ? (
              trainers.map((trainer) => (
                <div
                  key={trainer._id}
                  className="border rounded-lg p-4 flex flex-col items-center bg-white"
                >
                  <Image
                    src={trainer.imageUrl}
                    alt={trainer.name}
                    width={150}
                    height={150}
                    className="rounded-full mb-4 object-cover"
                  />
                  <h3 className="text-lg font-semibold mb-3 text-center">
                    {trainer.name}
                  </h3>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">No trainers found</div>
            )}
          </div>
        </div>
      )}
      {/* User Modal */}
      <UserModal
        isOpen={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        user={selectedUser}
        onSave={async (userData) => {
          try {
            if (selectedUser) {
              // Update existing user
              const response = await fetch(
                `/api/admin/users/${selectedUser._id || selectedUser.id}`,
                {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(userData),
                }
              );

              if (!response.ok) throw new Error("Failed to update user");
            } else {
              // Create new user
              const response = await fetch("/api/admin/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
              });

              if (!response.ok) throw new Error("Failed to create user");
            }

            setUserModalOpen(false);
            fetchDashboardData();
          } catch (err) {
            console.error("Error saving user:", err);
            setError(err.message);
            return Promise.reject(err);
          }
        }}
      />

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={subscriptionModalOpen}
        onClose={() => setSubscriptionModalOpen(false)}
        subscription={selectedSubscription}
        onSave={async (subscriptionData) => {
          try {
            if (selectedSubscription) {
              // Update existing subscription
              const response = await fetch(
                `/api/admin/subscriptions/${
                  selectedSubscription._id || selectedSubscription.id
                }`,
                {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(subscriptionData),
                }
              );

              if (!response.ok)
                throw new Error("Failed to update subscription");
            } else {
              // Create new subscription
              const response = await fetch("/api/admin/subscriptions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(subscriptionData),
              });

              if (!response.ok)
                throw new Error("Failed to create subscription");
            }

            setSubscriptionModalOpen(false);
            fetchDashboardData();
          } catch (err) {
            console.error("Error saving subscription:", err);
            setError(err.message);
            return Promise.reject(err);
          }
        }}
      />
    </div>
  );
}
