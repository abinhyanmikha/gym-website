"use client";
import { useEffect, useState } from "react";
import MembershipCard from "@/components/MembershipCard";
import Navbar from "@/components/Navbar";

export default function MembershipPlansPage() {
  const [plans, setPlans] = useState([]); // ✅ initialize as array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch("/api/subscription");
        const data = await res.json();

        if (Array.isArray(data)) {
          setPlans(data);
        } else {
          console.error("Unexpected API response:", data);
          setPlans([]); // fallback to empty array
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading) return <p>Loading plans...</p>;

  return (
    <div className="w-screen bg-gray-100 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <MembershipCard
            key={plan._id}
            subscriptionId={plan._id}
            title={plan.name}
            price={plan.price}
            duration={plan.duration}
            features={plan.features}
            includesCardio={plan.includesCardio}
            color="border-blue-500"
          />
        ))}
      </div>
    </div>
  );
}
