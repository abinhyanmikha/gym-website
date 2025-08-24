import MembershipCard from "@/components/MembershipCard";

export default function MembershipPlans() {
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
        {/* Monthly */}
        <MembershipCard
          title="Monthly Plan With Cardio"
          features={[
            "✅ Full Gym Access",
            "✅ Cardio Machines (Treadmill, Cycle, Rowing)",
            "✅ Weight Training",
            "✅ Personal Trainer Guidance",
          ]}
          price="3,500"
          color="border-t-4 border-green-600"
        />
        <MembershipCard
          title="Monthly Plan Without Cardio"
          features={[
            "✅ Full Gym Access",
            "❌ No Cardio Machines",
            "✅ Weight Training",
          ]}
          price="2,500"
          color="border-t-4 border-red-600"
        />

        {/* Quarterly */}
        <MembershipCard
          title="Quarterly Plan With Cardio"
          features={[
            "✅ Full Gym Access",
            "✅ Cardio Machines",
            "✅ Weight Training",
            "✅ Personal Trainer Guidance",
            "✅ 1 Diet Consultation",
          ]}
          price="9,500"
          color="border-t-4 border-green-600"
        />
        <MembershipCard
          title="Quarterly Plan Without Cardio"
          features={[
            "✅ Full Gym Access",
            "❌ No Cardio Machines",
            "✅ Weight Training",
          ]}
          price="7,000"
          color="border-t-4 border-red-600"
        />

        {/* Semiannual */}
        <MembershipCard
          title="Semiannual Plan With Cardio"
          features={[
            "✅ Full Gym Access",
            "✅ Cardio Machines",
            "✅ Weight Training",
            "✅ Personal Trainer Guidance",
            "✅ 2 Diet Consultations",
          ]}
          price="18,000"
          color="border-t-4 border-green-600"
        />
        <MembershipCard
          title="Semiannual Plan Without Cardio"
          features={[
            "✅ Full Gym Access",
            "❌ No Cardio Machines",
            "✅ Weight Training",
          ]}
          price="14,500"
          color="border-t-4 border-red-600"
        />

        {/* Yearly */}
        <MembershipCard
          title="Yearly Plan With Cardio"
          features={[
            "✅ Full Gym Access",
            "✅ Cardio Machines",
            "✅ Weight Training",
            "✅ Personal Trainer Guidance",
            "✅ 4 Diet Consultations",
            "✅ 1 Free Personal Training Session",
          ]}
          price="35,000"
          color="border-t-4 border-green-600"
        />
        <MembershipCard
          title="Yearly Plan Without Cardio"
          features={[
            "✅ Full Gym Access",
            "❌ No Cardio Machines",
            "✅ Weight Training",
          ]}
          price="28,000"
          color="border-t-4 border-red-600"
        />
      </div>
    </div>
  );
}
