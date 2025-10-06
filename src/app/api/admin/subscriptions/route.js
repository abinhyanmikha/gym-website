// src/app/api/subscriptions/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Subscription from "@/models/Subscription";

export async function GET() {
  try {
    await connectDB();
    const plans = await Subscription.find(); // ✅ returns an array
    return NextResponse.json(plans, { status: 200 });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json(
      { error: "Failed to fetch plans" },
      { status: 500 }
    );
  }
}
