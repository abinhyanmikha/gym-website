// src/app/api/admin/subscriptions/[id]/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Subscription from "@/models/Subscription";

// Need to export params to generate static paths at build time
export async function generateStaticParams() {
  // Return empty array if you don't want to pre-generate any paths
  return [];
}

// Helper function to extract params safely
async function getParams(request) {
  try {
    // For dynamic routes in App Router, we need to extract the ID from the URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split("/");
    const id = pathParts[pathParts.length - 1];
    return { id };
  } catch (error) {
    console.error("Error extracting params:", error);
    return { id: null };
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Extract ID from URL instead of params
    const { id } = await getParams(request);

    if (!id) {
      return NextResponse.json(
        { error: "Subscription ID is required" },
        { status: 400 }
      );
    }

    const subscription = await Subscription.findById(id);

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        subscription,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Extract ID from URL instead of params
    const { id } = await getParams(request);

    if (!id) {
      return NextResponse.json(
        { error: "Subscription ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, price, duration, features, includesCardio } = body;

    if (!name || !price || !duration || !features) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updatedSubscription = await Subscription.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        price: Number(price),
        duration: Number(duration),
        features: Array.isArray(features) ? features : [features],
        includesCardio: includesCardio || false,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedSubscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        subscription: updatedSubscription,
        message: "Subscription updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating subscription:", error);
    return NextResponse.json(
      { error: "Failed to update subscription" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Extract ID from URL instead of params
    const { id } = await getParams(request);

    if (!id) {
      return NextResponse.json(
        { error: "Subscription ID is required" },
        { status: 400 }
      );
    }

    const deletedSubscription = await Subscription.findByIdAndDelete(id);

    if (!deletedSubscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Subscription deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting subscription:", error);
    return NextResponse.json(
      { error: "Failed to delete subscription" },
      { status: 500 }
    );
  }
}
