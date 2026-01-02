import UserSubscription from "@/models/UserSubscription";
import { sendSubscriptionExpiredEmail } from "@/lib/email";

/**
 * Checks for expired subscriptions and updates their status in the database.
 * This can be called from API routes or Server Components.
 */
export async function updateExpiredSubscriptions() {
  try {
    const now = new Date();
    console.log(`Checking for expired subscriptions at ${now.toISOString()}`);
    
    // Find subscriptions that have expired but are still marked as 'active'
    const expiredSubscriptions = await UserSubscription.find({
      status: "active",
      endDate: { $lt: now }
    }).populate('userId', 'email name');
    
    console.log(`Found ${expiredSubscriptions.length} expired subscriptions to update`);
    
    let updatedCount = 0;
    
    for (const subscription of expiredSubscriptions) {
      try {
        console.log(`Updating subscription ${subscription._id} for user ${subscription.userId?.email} to expired`);
        // Update subscription status to expired
        await UserSubscription.findByIdAndUpdate(subscription._id, {
          status: "expired"
        });
        updatedCount++;
        
        // Send expired email if user info is available
        if (subscription.userId && subscription.userId.email) {
          await sendSubscriptionExpiredEmail(subscription.userId.email, {
            subscriptionName: subscription.plan,
            endDate: subscription.endDate,
            userName: subscription.userId.name
          });
          console.log(`Expiration notification sent to: ${subscription.userId.email}`);
        }
      } catch (error) {
        console.error(`Failed to process expired subscription ${subscription._id}:`, error);
      }
    }
    
    if (updatedCount > 0) {
      console.log(`Successfully updated ${updatedCount} subscriptions to expired`);
    }
    
    return updatedCount;
  } catch (error) {
    console.error("Error in updateExpiredSubscriptions:", error);
    throw error;
  }
}
