import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Payment from "@/models/Payment";

export async function POST(req) {
  try {
    const {
      userId,
      subscriptionId,
      subscriptionName,
      amount,
      transactionId,
      status,
    } = await req.json();

    console.log("[payment/store] incoming:", {
      userId,
      subscriptionId,
      subscriptionName,
      amount,
      transactionId,
      status,
    });

    if (
      !userId ||
      !subscriptionId ||
      !subscriptionName ||
      typeof amount !== "number" ||
      !transactionId
    ) {
      return NextResponse.json(
        { error: "Missing or invalid fields" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectDB();
    
    // Create a new payment with the provided status (or default to pending)
    const payment = await Payment.create({
      userId,
      subscriptionId,
      description: `Payment for ${subscriptionName} subscription`,
      amount,
      refId: transactionId,
      status: status || "pending", // Use provided status or default to pending
      createdAt: new Date()
    });
    
    console.log("Payment created:", payment);

    return NextResponse.json({ success: true, payment }, { status: 200 });
  } catch (err) {
    console.error("Payment store error:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Connect to MongoDB
    await connectDB();
    
    const payments = await Payment.find().sort({ createdAt: -1 }).limit(10);
    return NextResponse.json(payments, { status: 200 });
  } catch (err) {
    console.error("Payment retrieval error:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err.message },
      { status: 500 }
    );
  }
}
