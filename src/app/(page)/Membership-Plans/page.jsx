"use client";

import MembershipCard from "@/components/MembershipCard";
import Navbar from "@/components/Navbar";
import { useFetch } from "@/hooks/useFetch";

export default function MembershipPlansPage() {
  const { data: plans, loading } = useFetch("/api/subscription");

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="w-screen bg-gray-100 min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans?.map((plan) => (
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
