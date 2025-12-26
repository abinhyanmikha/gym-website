"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Image from "next/image";

export default function AdminTrainers() {
  const { data: session, status } = useSession();
  const [trainers, setTrainers] = useState([]);
  const [name, setName] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
    if (status === "authenticated" && session?.user?.role !== "admin") {
      redirect("/dashboard/user");
    }
  }, [status, session]);

  useEffect(() => {
    fetch("/api/trainers")
      .then((res) => res.json())
      .then((data) => setTrainers(data.trainers || []))
      .catch((err) => {
        console.error(err);
        setError("Failed to load trainers");
      });
  }, []);

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => setImageBase64(reader.result?.toString() || "");
  };

  const resetForm = () => {
    setName("");
    setImageBase64("");
  };

  const saveTrainer = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) return alert("Trainer name is required");
    if (!imageBase64) return alert("Trainer image is required");

    try {
      setError(null);
      const res = await fetch("/api/trainers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName, imageBase64 }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Action failed");
        return;
      }

      setTrainers((prev) => [data.trainer, ...prev]);

      resetForm();
    } catch (err) {
      console.error(err);
      setError("Action failed");
    }
  };

  if (status === "loading") return null;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Trainers</h1>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <div className="bg-gray-50 rounded-lg shadow p-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Trainer Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter trainer name"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Image
            </label>
            <input type="file" accept="image/*" onChange={handleImage} />
          </div>
        </div>

        {imageBase64 && (
            <div className="mt-4 flex items-center gap-4">
              <Image
                src={imageBase64}
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
              <h2 className="text-xl font-semibold mb-2 text-center">
                {trainer.name}
              </h2>
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-500">No trainers found</div>
        )}
      </div>
    </div>
  );
}
