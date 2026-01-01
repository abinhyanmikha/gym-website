import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

const ALLOWED_TABS = ["overview", "users", "subscriptions", "payments", "trainers"];

export function useAdminDashboard() {
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

  // Modal states
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  // Check authentication
  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
    if (status === "authenticated" && session?.user?.role !== "admin") router.replace("/dashboard/user");
  }, [status, session, router]);

  // Tab handling
  useEffect(() => {
    const nextTab = (tabParam || "overview").toLowerCase();
    if (!ALLOWED_TABS.includes(nextTab)) {
      router.replace("/dashboard/admin?tab=overview");
      return;
    }
    if (nextTab !== activeTab) {
      setActiveTab(nextTab);
      setSearchTerm("");
    }
  }, [tabParam, router, activeTab]);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const statsRes = await fetch("/api/admin/stats");
      if (statsRes.ok) setStats(await statsRes.json());

      if (activeTab === "users" || activeTab === "overview") {
        const res = await fetch("/api/admin/users");
        if (res.ok) {
          const data = await res.json();
          setUsers(Array.isArray(data) ? data : data.users || []);
        }
      }

      if (activeTab === "subscriptions" || activeTab === "overview") {
        const res = await fetch("/api/admin/subscriptions");
        if (res.ok) {
          const data = await res.json();
          setSubscriptions(Array.isArray(data) ? data : data.plans || []);
        }
      }

      if (activeTab === "payments" || activeTab === "overview") {
        const res = await fetch("/api/admin/payments");
        if (res.ok) {
          const data = await res.json();
          setPayments(Array.isArray(data) ? data : data.payments || []);
        }
      }

      if (activeTab === "trainers") {
        const res = await fetch("/api/trainers");
        if (res.ok) {
          const data = await res.json();
          setTrainers(data.trainers || []);
        }
      }
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "admin") {
      fetchDashboardData();
    }
  }, [status, session, activeTab, fetchDashboardData]);

  const normalize = (value) => (value ?? "").toString().toLowerCase();

  const visibleUsers = activeTab === "users" && searchTerm.trim()
    ? users.filter(u => normalize(u?.name).includes(normalize(searchTerm)) || normalize(u?.email).includes(normalize(searchTerm)))
    : users;

  const visibleSubscriptions = searchTerm.trim()
    ? subscriptions.filter(p => normalize(p?.name).includes(normalize(searchTerm)) || normalize(Array.isArray(p?.features) ? p.features.join(" ") : "").includes(normalize(searchTerm)))
    : subscriptions;

  const visiblePayments = searchTerm.trim()
    ? payments.filter(p => {
        const q = normalize(searchTerm);
        return normalize(p?.user?.name).includes(q) || normalize(p?.user?.email).includes(q) || normalize(p?.plan?.name || p?.subscriptionName).includes(q);
      })
    : payments;

  const handleDeleteUser = async (id) => {
    if (confirm("Delete this user?")) {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (res.ok) fetchDashboardData();
      else setError("Failed to delete user");
    }
  };

  const handleDeleteSubscription = async (id) => {
    if (confirm("Delete this plan?")) {
      const res = await fetch(`/api/admin/subscriptions/${id}`, { method: "DELETE" });
      if (res.ok) fetchDashboardData();
      else setError("Failed to delete subscription plan");
    }
  };

  const handleSaveUser = async (userData) => {
    try {
      const isUpdate = !!selectedUser;
      const url = isUpdate ? `/api/admin/users/${selectedUser._id || selectedUser.id}` : "/api/admin/users";
      const res = await fetch(url, {
        method: isUpdate ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (!res.ok) throw new Error(`Failed to ${isUpdate ? "update" : "create"} user`);
      setUserModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const handleSaveSubscription = async (data) => {
    try {
      const isUpdate = !!selectedSubscription;
      const url = isUpdate ? `/api/admin/subscriptions/${selectedSubscription._id || selectedSubscription.id}` : "/api/admin/subscriptions";
      const res = await fetch(url, {
        method: isUpdate ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Failed to ${isUpdate ? "update" : "create"} subscription`);
      setSubscriptionModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    activeTab, stats, users, subscriptions, payments, trainers, loading, error, setError,
    searchTerm, setSearchTerm, fetchDashboardData, visibleUsers, visibleSubscriptions, visiblePayments,
    handleDeleteUser, handleDeleteSubscription, handleSaveUser, handleSaveSubscription,
    userModalOpen, setUserModalOpen, subscriptionModalOpen, setSubscriptionModalOpen,
    selectedUser, setSelectedUser, selectedSubscription, setSelectedSubscription,
    setTrainers
  };
}
