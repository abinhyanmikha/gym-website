"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import DashboardNav from "@/components/DashboardNav";
import UserModal from "@/components/admin/UserModal";
import SubscriptionModal from "@/components/admin/SubscriptionModal";
import { sortData, searchAndSort } from "@/lib/sorting";

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Sorting and search states
  const [userSort, setUserSort] = useState({ key: 'name', direction: 'asc', type: 'string' });
  const [paymentSort, setPaymentSort] = useState({ key: 'createdAt', direction: 'desc', type: 'date' });
  const [subscriptionSort, setSubscriptionSort] = useState({ key: 'name', direction: 'asc', type: 'string' });
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  // Check authentication
  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }
    
    if (status === "authenticated" && session?.user?.role !== "admin") {
      redirect("/dashboard/user");
    }
  }, [status, session]);

  // Sorting handler functions
  const handleSort = (tableType, key, type = 'string') => {
    console.log('handleSort called:', { tableType, key, type });
    const currentSort = tableType === 'users' ? userSort : 
                       tableType === 'payments' ? paymentSort : subscriptionSort;
    
    const newDirection = currentSort.key === key && currentSort.direction === 'asc' ? 'desc' : 'asc';
    const newSort = { key, direction: newDirection, type };
    
    console.log('New sort config:', newSort);
    
    if (tableType === 'users') {
      setUserSort(newSort);
    } else if (tableType === 'payments') {
      setPaymentSort(newSort);
    } else {
      setSubscriptionSort(newSort);
    }
  };

  // Get sorted data with optimal algorithm selection
  const getSortedUsers = () => {
    console.log('getSortedUsers called:', { users: users.length, userSort, searchTerm });
    if (!users || users.length === 0) return [];
    
    const algorithm = users.length > 1000 ? 'quickSort' : 'mergeSort';
    const result = searchAndSort(users, searchTerm, ['name', 'email'], userSort, algorithm);
    console.log('getSortedUsers result:', result.length);
    return result;
  };

  const getSortedPayments = () => {
    console.log('getSortedPayments called:', { payments: payments.length, paymentSort });
    if (!payments || payments.length === 0) return [];
    
    const algorithm = payments.length > 1000 ? 'quickSort' : 'mergeSort';
    const result = sortData(payments, paymentSort, algorithm);
    console.log('getSortedPayments result:', result.length);
    return result;
  };

  const getSortedSubscriptions = () => {
    console.log('getSortedSubscriptions called:', { subscriptions: subscriptions.length, subscriptionSort });
    if (!subscriptions || subscriptions.length === 0) return [];
    
    const algorithm = subscriptions.length > 100 ? 'quickSort' : 'mergeSort';
    const result = sortData(subscriptions, subscriptionSort, algorithm);
    console.log('getSortedSubscriptions result:', result.length);
    return result;
  };

  // Sort icon component
  const SortIcon = ({ column, currentSort }) => {
    if (currentSort.key !== column) {
      return <span className="ml-1 text-gray-400 cursor-pointer">↕</span>;
    }
    return (
      <span className="ml-1 text-blue-600">
        {currentSort.direction === 'asc' ? '↑' : '↓'}
      </span>
    );
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
      const statsResponse = await fetch('/api/admin/stats');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      } else {
        throw new Error('Failed to fetch stats');
      }

      // Fetch data based on active tab
      if (activeTab === "users" || activeTab === "overview") {
        const usersResponse = await fetch('/api/admin/users');
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          // Handle both old array format and new paginated format
          setUsers(Array.isArray(usersData) ? usersData : usersData.users || []);
        } else {
          throw new Error('Failed to fetch users');
        }
      }

      if (activeTab === "subscriptions" || activeTab === "overview") {
        const subscriptionsResponse = await fetch('/api/admin/subscriptions');
        if (subscriptionsResponse.ok) {
          const subscriptionsData = await subscriptionsResponse.json();
          // Handle both old array format and new paginated format
          setSubscriptions(Array.isArray(subscriptionsData) ? subscriptionsData : subscriptionsData.plans || []);
        } else {
          throw new Error('Failed to fetch subscriptions');
        }
      }

      if (activeTab === "payments" || activeTab === "overview") {
        const paymentsResponse = await fetch('/api/admin/payments');
        if (paymentsResponse.ok) {
          const paymentsData = await paymentsResponse.json();
          // Handle both old array format and new paginated format
          setPayments(Array.isArray(paymentsData) ? paymentsData : paymentsData.payments || []);
        } else {
          throw new Error('Failed to fetch payments');
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
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <LogoutButton />
      </div>
      
      {/* Navigation Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
          <li className="mr-2">
            <button 
              className={`inline-block p-4 rounded-t-lg ${activeTab === "overview" ? "text-blue-600 border-b-2 border-blue-600" : "hover:text-gray-600 hover:border-gray-300"}`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
          </li>
          <li className="mr-2">
            <button 
              className={`inline-block p-4 rounded-t-lg ${activeTab === "users" ? "text-blue-600 border-b-2 border-blue-600" : "hover:text-gray-600 hover:border-gray-300"}`}
              onClick={() => setActiveTab("users")}
            >
              Users
            </button>
          </li>
          <li className="mr-2">
            <button 
              className={`inline-block p-4 rounded-t-lg ${activeTab === "subscriptions" ? "text-blue-600 border-b-2 border-blue-600" : "hover:text-gray-600 hover:border-gray-300"}`}
              onClick={() => setActiveTab("subscriptions")}
            >
              Subscriptions
            </button>
          </li>
          <li>
            <button 
              className={`inline-block p-4 rounded-t-lg ${activeTab === "payments" ? "text-blue-600 border-b-2 border-blue-600" : "hover:text-gray-600 hover:border-gray-300"}`}
              onClick={() => setActiveTab("payments")}
            >
              Payments
            </button>
          </li>
        </ul>
      </div>
      
      {/* Stats Cards - Show only on overview */}
      {activeTab === "overview" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-100 p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">Total Users</h2>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">Active Subscriptions</h2>
              <p className="text-3xl font-bold">{stats.activeSubscriptions}</p>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">Total Revenue</h2>
              <p className="text-3xl font-bold">Rs. {(stats.totalRevenue ?? 0).toLocaleString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-amber-100 p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">Daily Revenue</h2>
              <p className="text-3xl font-bold">Rs. {(stats.dailyRevenue ?? 0).toLocaleString()}</p>
            </div>
            <div className="bg-indigo-100 p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">Monthly Revenue</h2>
              <p className="text-3xl font-bold">Rs. {(stats.monthlyRevenue ?? 0).toLocaleString()}</p>
            </div>
            <div className="bg-rose-100 p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">Yearly Revenue</h2>
              <p className="text-3xl font-bold">Rs. {(stats.yearlyRevenue ?? 0).toLocaleString()}</p>
            </div>
          </div>
        </>
      )}
      
      {/* Loading and Error States */}
      {loading && <div className="text-center py-4">Loading data...</div>}
      {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}
      
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
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSort('users', 'name', 'string')}
                  >
                    Name <SortIcon column="name" currentSort={userSort} />
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSort('users', 'email', 'email')}
                  >
                    Email <SortIcon column="email" currentSort={userSort} />
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSort('users', 'role', 'string')}
                  >
                    Role <SortIcon column="role" currentSort={userSort} />
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSort('users', 'createdAt', 'date')}
                  >
                    Joined <SortIcon column="createdAt" currentSort={userSort} />
                  </th>
                  {activeTab === "users" && (
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getSortedUsers().length > 0 ? (
                  getSortedUsers().map((user) => (
                    <tr key={user._id || user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt || Date.now()).toLocaleDateString()}
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
                              if (confirm('Are you sure you want to delete this user?')) {
                                try {
                                  const response = await fetch(`/api/admin/users/${user._id || user.id}`, {
                                    method: 'DELETE'
                                  });
                                  if (response.ok) {
                                    fetchDashboardData();
                                  } else {
                                    setError('Failed to delete user');
                                  }
                                } catch (err) {
                                  console.error('Error deleting user:', err);
                                  setError('Failed to delete user');
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
                    <td colSpan={activeTab === "users" ? 5 : 4} className="px-6 py-4 text-center text-sm text-gray-500">
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
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSort('subscriptions', 'name', 'string')}
                  >
                    Name <SortIcon column="name" currentSort={subscriptionSort} />
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSort('subscriptions', 'price', 'number')}
                  >
                    Price <SortIcon column="price" currentSort={subscriptionSort} />
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSort('subscriptions', 'duration', 'number')}
                  >
                    Duration <SortIcon column="duration" currentSort={subscriptionSort} />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Features</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getSortedSubscriptions().length > 0 ? (
                  getSortedSubscriptions().map((subscription) => (
                    <tr key={subscription._id || subscription.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{subscription.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">${subscription.price}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{subscription.duration} days</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {subscription.features && subscription.features.slice(0, 2).map((feature, index) => (
                            <div key={index}>{feature}</div>
                          ))}
                          {subscription.features && subscription.features.length > 2 && (
                            <div>+{subscription.features.length - 2} more</div>
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
                            if (confirm('Are you sure you want to delete this subscription plan?')) {
                              try {
                                const response = await fetch(`/api/admin/subscriptions/${subscription._id || subscription.id}`, {
                                  method: 'DELETE'
                                });
                                if (response.ok) {
                                  fetchDashboardData();
                                } else {
                                  setError('Failed to delete subscription plan');
                                }
                              } catch (err) {
                                console.error('Error deleting subscription:', err);
                                setError('Failed to delete subscription plan');
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
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
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
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSort('payments', 'userName', 'string')}
                  >
                    User <SortIcon column="userName" currentSort={paymentSort} />
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSort('payments', 'planName', 'string')}
                  >
                    Plan <SortIcon column="planName" currentSort={paymentSort} />
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSort('payments', 'amount', 'number')}
                  >
                    Amount <SortIcon column="amount" currentSort={paymentSort} />
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSort('payments', 'createdAt', 'date')}
                  >
                    Date <SortIcon column="createdAt" currentSort={paymentSort} />
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSort('payments', 'status', 'string')}
                  >
                    Status <SortIcon column="status" currentSort={paymentSort} />
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getSortedPayments().length > 0 ? (
                  getSortedPayments().map((payment) => (
                    <tr key={payment._id || payment.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{payment.userName || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">{payment.userEmail || 'No email'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{payment.planName || 'Unknown Plan'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${payment.amount}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(payment.createdAt || Date.now()).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          payment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {payment.status || 'unknown'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                      No payment history found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
              const response = await fetch(`/api/admin/users/${selectedUser._id || selectedUser.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
              });
              
              if (!response.ok) throw new Error('Failed to update user');
            } else {
              // Create new user
              const response = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
              });
              
              if (!response.ok) throw new Error('Failed to create user');
            }
            
            setUserModalOpen(false);
            fetchDashboardData();
          } catch (err) {
            console.error('Error saving user:', err);
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
              const response = await fetch(`/api/admin/subscriptions/${selectedSubscription._id || selectedSubscription.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(subscriptionData)
              });
              
              if (!response.ok) throw new Error('Failed to update subscription');
            } else {
              // Create new subscription
              const response = await fetch('/api/admin/subscriptions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(subscriptionData)
              });
              
              if (!response.ok) throw new Error('Failed to create subscription');
            }
            
            setSubscriptionModalOpen(false);
            fetchDashboardData();
          } catch (err) {
            console.error('Error saving subscription:', err);
            setError(err.message);
            return Promise.reject(err);
          }
        }}
      />
    </div>
  );
}
