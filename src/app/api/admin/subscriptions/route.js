// src/app/api/admin/subscriptions/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Subscription from "@/models/Subscription";

// GET /api/admin/subscriptions (used in fetchDashboardData)
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get all subscriptions for admin dashboard
    const plans = await Subscription.find({}).sort({ createdAt: -1 });

    return NextResponse.json(
      {
        plans,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json(
      { error: "Failed to fetch plans" },
      { status: 500 }
    );
  }
}

// POST /api/admin/subscriptions (used in create operation)
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { name, price, duration, features, includesCardio } = body;

    if (!name || !price || !duration || !features) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new subscription
    const newSubscription = await Subscription.create({
      name: name.trim(),
      price: Number(price),
      duration: Number(duration),
      features: Array.isArray(features) ? features : [features],
      includesCardio: includesCardio || false,
    });

    return NextResponse.json(
      {
        success: true,
        subscription: newSubscription,
        message: "Subscription created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 }
    );
  }
}
