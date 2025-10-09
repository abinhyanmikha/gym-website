import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import UserSubscription from "@/models/UserSubscription";
import User from "@/models/User";
import { sendSubscriptionExpirationEmail, sendSubscriptionExpiredEmail } from "@/lib/email";

export async function POST(req) {
  try {
    await connectDB();
    
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000)); // 3 days from now
    
    // Find subscriptions expiring in 3 days (warning email)
    const expiringSubscriptions = await UserSubscription.find({
      status: "active",
      endDate: {
        $gte: now,
        $lte: threeDaysFromNow
      }
    }).populate('userId', 'email name');
    
    // Find subscriptions that have expired (expired email)
    const expiredSubscriptions = await UserSubscription.find({
      status: "active",
      endDate: {
        $lt: now
      }
    }).populate('userId', 'email name');
    
    let emailsSent = 0;
    let subscriptionsUpdated = 0;
    
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
          console.log(`Expiration warning sent to: ${subscription.userId.email}`);
        }
      } catch (emailError) {
        console.error(`Failed to send expiration warning to ${subscription.userId?.email}:`, emailError);
      }
    }
    
    // Send expired emails and update subscription status
    for (const subscription of expiredSubscriptions) {
      try {
        // Update subscription status to expired
        await UserSubscription.findByIdAndUpdate(subscription._id, {
          status: "expired"
        });
        subscriptionsUpdated++;
        
        // Send expired email
        if (subscription.userId && subscription.userId.email) {
          await sendSubscriptionExpiredEmail(subscription.userId.email, {
            subscriptionName: subscription.plan,
            endDate: subscription.endDate,
            userName: subscription.userId.name
          });
          emailsSent++;
          console.log(`Expiration notification sent to: ${subscription.userId.email}`);
        }
      } catch (error) {
        console.error(`Failed to process expired subscription ${subscription._id}:`, error);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Processed ${expiringSubscriptions.length} expiring and ${expiredSubscriptions.length} expired subscriptions`,
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