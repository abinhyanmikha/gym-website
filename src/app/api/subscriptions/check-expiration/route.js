import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import UserSubscription from "@/models/UserSubscription";
import { sendSubscriptionExpirationEmail } from "@/lib/email";
import { updateExpiredSubscriptions } from "@/lib/subscriptions";

export async function POST(req) {
  try {
    await connectDB();
    
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000));
    
    // Find subscriptions expiring in 3 days (warning email)
    const expiringSubscriptions = await UserSubscription.find({
      status: "active",
      endDate: {
        $gte: now,
        $lte: threeDaysFromNow
      }
    }).populate('userId', 'email name');
    
    let emailsSent = 0;
    
    // Send expiration warning emails
    for (const subscription of expiringSubscriptions) {
      try {
        if (subscription.userId && subscription.userId.email) {
          await sendSubscriptionExpirationEmail(subscription.userId.email, {
            subscriptionName: subscription.plan,
            endDate: subscription.endDate,
            userName: subscription.userId.name
          });
          emailsSent++;
        }
      } catch (emailError) {
        console.error(`Failed to send expiration warning:`, emailError);
      }
    }
    
    // Use utility to update expired subscriptions
    const subscriptionsUpdated = await updateExpiredSubscriptions();
    
    return NextResponse.json({
      success: true,
      message: `Processed ${expiringSubscriptions.length} expiring and updated ${subscriptionsUpdated} expired subscriptions`,
      emailsSent,
      subscriptionsUpdated
    });
    
  } catch (error) {
    console.error("Subscription expiration check error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// Allow GET requests for manual testing
export async function GET(req) {
  return POST(req);
}