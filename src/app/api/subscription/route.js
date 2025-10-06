// src/app/subscription/route.js
import connectDB from "@/lib/mongodb";
import Subscription from "@/models/Subscription";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const subscriptions = await Subscription.find({});
    return NextResponse.json(subscriptions, { status: 200 });
  } catch (error) {
    console.error("Error fetching subscriptions from MongoDB:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscriptions" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const newSubscription = await Subscription.create(body);
    return NextResponse.json(newSubscription, { status: 201 });
  } catch (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 }
    );
  }
}
