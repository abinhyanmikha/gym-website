// app/api/esewa/verify/route.js
import Subscription from "@/models/Subscription";
import dbConnect from "@/lib/mongodb";

export async function POST(req) {
  try {
    const body = await req.json();
    const { transaction_uuid, total_amount, product_code } = body;

    if (!transaction_uuid || !total_amount || !product_code) {
      return new Response(
        JSON.stringify({ message: "Missing payment parameters" }),
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await dbConnect();

    // Simulate verification (replace with real eSewa API call in production)
    const verified = true;

    if (verified) {
      await Subscription.findOneAndUpdate(
        { transaction_uuid },
        { status: "active" },
        { new: true, upsert: true }
      );

      return new Response(
        JSON.stringify({
          message: "Payment verified and subscription activated",
        }),
        { status: 200 }
      );
    } else {
      return new Response(
        JSON.stringify({ message: "Payment verification failed" }),
        { status: 400 }
      );
    }
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}
