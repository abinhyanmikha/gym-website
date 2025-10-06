import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import UserSubscription from "@/models/UserSubscription";
import Payment from "@/models/Payment";

export async function POST(req) {
  try {
    // Parse request body with error handling
    let body;
    try {
      body = await req.json();
    } catch (error) {
      console.error("Failed to parse request body:", error);
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { amount, refId, userId, subscriptionName, subscriptionId } = body;

    // Validate required fields with detailed logging
    console.log("Received verification request:", {
      amount,
      refId,
      userId,
      subscriptionName,
      subscriptionId,
    });

    if (!amount) {
      console.error("Missing amount in verification request");
      return NextResponse.json({ error: "Missing amount" }, { status: 400 });
    }
    if (!refId) {
      console.error("Missing refId in verification request");
      return NextResponse.json({ error: "Missing refId" }, { status: 400 });
    }
    if (!userId) {
      console.error("Missing userId in verification request");
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }
    if (!subscriptionName) {
      console.error("Missing subscriptionName in verification request");
      return NextResponse.json(
        { error: "Missing subscriptionName" },
        { status: 400 }
      );
    }
    if (!subscriptionId) {
      console.error("Missing subscriptionId in verification request");
      return NextResponse.json(
        { error: "Missing subscriptionId" },
        { status: 400 }
      );
    }

    // ✅ TODO: Verify with eSewa API
    const isVerified = true;

    if (!isVerified) {
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 }
      );
    }

    // Connect to MongoDB with error handling
    try {
      await connectDB();
      console.log("Connected to MongoDB successfully");
    } catch (dbError) {
      console.error("MongoDB connection error:", dbError);
      return NextResponse.json(
        { error: "Database connection failed", details: dbError.message },
        { status: 500 }
      );
    }

    // 1) Mark payment as success
    try {
      // First check if payment exists
      let updatedPayment = await Payment.findOne({ refId: refId });

      if (!updatedPayment) {
        console.log("Payment not found, creating new payment record");
        // Create a new payment record if it doesn't exist
        updatedPayment = await Payment.create({
          userId,
          subscriptionId, // Add subscription ID
          subscriptionName, // Add subscription name - this was missing!
          amount: parseFloat(amount), // Ensure amount is a number
          refId,
          status: "success",
          createdAt: new Date(),
        });
      } else {
        console.log("Payment found, updating to success:", updatedPayment._id);
        // Update existing payment to success
        updatedPayment = await Payment.findOneAndUpdate(
          { refId: refId },
          { status: "success" },
          { new: true }
        );
      }

      console.log(
        "Payment updated:",
        updatedPayment ? updatedPayment._id : "Not found"
      );
    } catch (paymentError) {
      console.error("Payment update error:", paymentError);
      return NextResponse.json(
        { error: "Failed to update payment", details: paymentError.message },
        { status: 500 }
      );
    }

    // 2) Create/activate user subscription
    try {
      // Calculate end date based on subscription name
      let durationInDays = 30; // Default to 30 days

      if (
        subscriptionName.toLowerCase().includes("monthly") ||
        subscriptionName.toLowerCase().includes("basic")
      ) {
        durationInDays = 30;
      } else if (
        subscriptionName.toLowerCase().includes("quarterly") ||
        subscriptionName.toLowerCase().includes("standard")
      ) {
        durationInDays = 90;
      } else if (
        subscriptionName.toLowerCase().includes("yearly") ||
        subscriptionName.toLowerCase().includes("premium")
      ) {
        durationInDays = 365;
      }

      console.log(
        `Subscription duration: ${durationInDays} days for ${subscriptionName}`
      );

      // Check if subscription already exists
      let subscription = await UserSubscription.findOne({
        userId,
        transactionId: refId,
      });

      if (!subscription) {
        console.log("Creating new subscription");
        // Create new subscription if it doesn't exist
        subscription = await UserSubscription.create({
          userId,
          subscriptionId, // Add the subscription ID reference
          plan: subscriptionName,
          amount: parseFloat(amount), // Ensure amount is a number
          transactionId: refId,
          status: "active",
          startDate: new Date(),
          endDate: new Date(Date.now() + durationInDays * 24 * 60 * 60 * 1000),
        });
      } else {
        console.log("Updating existing subscription:", subscription._id);
        // Update existing subscription to active
        subscription = await UserSubscription.findOneAndUpdate(
          { userId, transactionId: refId },
          {
            status: "active",
            endDate: new Date(
              Date.now() + durationInDays * 24 * 60 * 60 * 1000
            ),
          },
          { new: true }
        );
      }

      console.log("Subscription processed successfully:", subscription._id);
      return NextResponse.json(
        { success: true, subscription },
        { status: 200 }
      );
    } catch (subscriptionError) {
      console.error("Subscription creation/update error:", subscriptionError);
      return NextResponse.json(
        {
          error: "Failed to process subscription",
          details: subscriptionError.message,
        },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("Esewa verification error:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err.message },
      { status: 500 }
    );
  }
}
