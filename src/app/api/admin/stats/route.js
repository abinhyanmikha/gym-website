import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import UserSubscription from "@/models/UserSubscription";
import Payment from "@/models/Payment";

export async function GET(request) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Connect to MongoDB
    await connectDB();

    // Calculate stats from MongoDB
    const totalUsers = await User.countDocuments();

    // Count active subscriptions (user subscriptions that are currently active)
    const activeSubscriptions = await UserSubscription.countDocuments({
      status: "active",
    });

    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const revenueResult = await Payment.aggregate([
      { $match: { status: "success" } },
      {
        $facet: {
          total: [{ $group: { _id: null, total: { $sum: "$amount" } } }],
          daily: [
            { $match: { createdAt: { $gte: startOfToday } } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
          ],
          monthly: [
            { $match: { createdAt: { $gte: startOfMonth } } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
          ],
          yearly: [
            { $match: { createdAt: { $gte: startOfYear } } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
          ],
        },
      },
    ]);

    const facets = revenueResult?.[0] || {};
    const totalRevenue = facets.total?.[0]?.total || 0;
    const dailyRevenue = facets.daily?.[0]?.total || 0;
    const monthlyRevenue = facets.monthly?.[0]?.total || 0;
    const yearlyRevenue = facets.yearly?.[0]?.total || 0;

    return new Response(
      JSON.stringify({
        totalUsers,
        activeSubscriptions,
        totalRevenue,
        dailyRevenue,
        monthlyRevenue,
        yearlyRevenue,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
