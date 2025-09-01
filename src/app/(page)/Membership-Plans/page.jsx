"use client";

import MembershipCard from "@/components/MembershipCard";
import { useEffect, useState } from "react";

export default function MembershipPlans() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    // Fetch subscription plans from the API
    async function fetchPlans() {
      try {
        const res = await fetch("/api/subscription");
        const data = await res.json();
        console.log("fetched plan", data);
        setPlans(data);
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    }
    fetchPlans();
  }, []);

  return (
    <div className="w-screen bg-gray-100 py-10 px-4">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center">
        AJIMA Physical Fitness Membership Plans
      </h1>
      <p className="text-center mt-4 text-base sm:text-lg">
        Choose the plan that suits you best and start your fitness journey
        today!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto mt-8">
        {plans.length > 0 ? (
          plans.map((plan) => (
            <MembershipCard
              key={plan._id}
              title={plan.name}
              features={plan.features}
              price={plan.price}
              color={plan.color || "border-t-4 border-blue-500"}
              duration={plan.duration}
            />
          ))
        ) : (
          <p className="text-center col-span-full">Loading plans...</p>
        )}
      </div>
    </div>
  );
}
