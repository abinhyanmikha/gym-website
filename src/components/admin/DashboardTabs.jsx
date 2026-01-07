import DataTable from "@/components/dashboard/DataTable";
import SearchInput from "@/components/dashboard/SearchInput";
import DashboardSection from "@/components/dashboard/DashboardSection";
import Image from "next/image";
import { useState } from "react";

export function UsersTab({ visibleUsers, activeTab, setSelectedUser, setUserModalOpen, searchTerm, setSearchTerm, handleDeleteUser }) {
  return (
    <DashboardSection
      title="Users"
      actions={
        activeTab === "users" && (
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => { setSelectedUser(null); setUserModalOpen(true); }}
          >
            Add New User
          </button>
        )
      }
    >
      {activeTab === "users" && (
        <SearchInput placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      )}
      <DataTable
        headers={[{ label: "Name" }, { label: "Email" }, { label: "Role" }, { label: "Joined" }, ...(activeTab === "users" ? [{ label: "Actions", align: "right" }] : [])]}
        data={visibleUsers}
        emptyMessage="No users found"
        renderRow={(user) => (
          <tr key={user._id || user.id}>
            <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{user.name}</div></td>
            <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">{user.email}</div></td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800"}`}>
                {user.role}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.createdAt || Date.now()).toLocaleDateString()}</td>
            {activeTab === "users" && (
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-indigo-600 hover:text-indigo-900 mr-3" onClick={() => { setSelectedUser(user); setUserModalOpen(true); }}>Edit</button>
                <button className="text-red-600 hover:text-red-900" onClick={() => handleDeleteUser(user._id || user.id)}>Delete</button>
              </td>
            )}
          </tr>
        )}
      />
    </DashboardSection>
  );
}

export function SubscriptionsTab({ visibleSubscriptions, setSelectedSubscription, setSubscriptionModalOpen, searchTerm, setSearchTerm, handleDeleteSubscription }) {
  return (
    <DashboardSection
      title="Subscription Plans"
      actions={<button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={() => { setSelectedSubscription(null); setSubscriptionModalOpen(true); }}>Add New Plan</button>}
    >
      <SearchInput placeholder="Search plans..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      <DataTable
        headers={[{ label: "Name" }, { label: "Price" }, { label: "Duration" }, { label: "Features" }, { label: "Actions", align: "right" }]}
        data={visibleSubscriptions}
        emptyMessage="No plans found"
        renderRow={(sub) => (
          <tr key={sub._id || sub.id}>
            <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{sub.name}</div></td>
            <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">Rs. {sub.price}</div></td>
            <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">{sub.duration} days</div></td>
            <td className="px-6 py-4">
              <div className="text-sm text-gray-500">
                {sub.features?.slice(0, 2).map((f, i) => <div key={i}>{f}</div>)}
                {sub.features?.length > 2 && <div>+{sub.features.length - 2} more</div>}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button className="text-indigo-600 hover:text-indigo-900 mr-3" onClick={() => { setSelectedSubscription(sub); setSubscriptionModalOpen(true); }}>Edit</button>
              <button className="text-red-600 hover:text-red-900" onClick={() => handleDeleteSubscription(sub._id || sub.id)}>Delete</button>
            </td>
          </tr>
        )}
      />
    </DashboardSection>
  );
}

export function PaymentsTab({ visiblePayments, searchTerm, setSearchTerm }) {
  return (
    <DashboardSection title="Payment History">
      <SearchInput placeholder="Search payments..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      <DataTable
        headers={[{ label: "User" }, { label: "Plan" }, { label: "Amount" }, { label: "Date" }, { label: "Status" }]}
        data={visiblePayments}
        emptyMessage="No payments found"
        renderRow={(p) => (
          <tr key={p._id || p.id}>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-gray-900">{p.user?.name || "Unknown"}</div>
              <div className="text-sm text-gray-500">{p.user?.email || "No email"}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{p.plan?.name || p.subscriptionName || "Unknown Plan"}</div>
              <div className="text-sm text-gray-500">{p.plan ? `Rs. ${p.plan.price} • ${p.plan.duration} days` : `ID: ${p.subscriptionId}`}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-900">Rs. {Number(p.amount || 0).toLocaleString()}</div></td>
            <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">{new Date(p.createdAt || Date.now()).toLocaleDateString()}</div></td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${p.status === "success" ? "bg-green-100 text-green-800" : p.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>
                {p.status || "unknown"}
              </span>
            </td>
          </tr>
        )}
      />
    </DashboardSection>
  );
}

export function TrainersTab({ trainers, setTrainers, setError }) {
  const [trainerName, setTrainerName] = useState("");
  const [trainerImageBase64, setTrainerImageBase64] = useState("");

  const handleTrainerImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => setTrainerImageBase64(reader.result?.toString() || "");
  };

  const saveTrainer = async () => {
    if (!trainerName.trim() || !trainerImageBase64) return alert("All fields required");
    try {
      const res = await fetch("/api/trainers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trainerName.trim(), imageBase64: trainerImageBase64 }),
      });
      const data = await res.json();
      if (res.ok) {
        setTrainers(prev => [data.trainer, ...prev]);
        setTrainerName("");
        setTrainerImageBase64("");
      } else setError(data?.error || "Failed to save trainer");
    } catch (err) { setError("Failed to save trainer"); }
  };

  return (
    <DashboardSection title="Trainers">
      <div className="bg-gray-50 rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Trainer Name</label>
            <input type="text" value={trainerName} onChange={(e) => setTrainerName(e.target.value)} className="w-full px-3 py-2 border rounded-md" placeholder="Trainer name" />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Image</label>
            <input type="file" accept="image/*" onChange={handleTrainerImage} />
          </div>
        </div>
        {trainerImageBase64 && <Image src={trainerImageBase64} alt="Preview" width={64} height={64} className="mt-4 rounded-full object-cover" />}
        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded" onClick={saveTrainer}>Add Trainer</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {trainers.map((t) => (
          <div key={t._id} className="border rounded-lg p-4 flex flex-col items-center bg-white">
            <Image src={t.imageUrl} alt={t.name} width={150} height={150} className="rounded-full mb-4 object-cover" />
            <h3 className="text-lg font-semibold">{t.name}</h3>
          </div>
        ))}
        {trainers.length === 0 && <div className="text-gray-500">No trainers found</div>}
      </div>
    </DashboardSection>
  );
}
