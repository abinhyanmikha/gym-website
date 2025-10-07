import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Subscription from "@/models/Subscription";
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
    const totalSubscriptions = await Subscription.countDocuments();

    // Calculate total revenue from completed payments
    const revenueResult = await Payment.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    return new Response(
      JSON.stringify({
        totalUsers,
        totalSubscriptions,
        totalRevenue,
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
