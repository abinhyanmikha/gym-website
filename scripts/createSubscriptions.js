import "dotenv/config";
import { connectDB } from "../src/lib/mongodb.js";
import Subscription from "../src/models/Subscription.js";

async function fetchAllSubscriptions() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Fetch all subscription plans
    const plans = await Subscription.find();

    if (plans.length === 0) {
      console.log("⚠️ No subscription plans found in the database.");
    } else {
      console.log("✅ Subscription Plans:");
      plans.forEach((plan, index) => {
        console.log(`${index + 1}. ${plan.name} - $${plan.price}/month`);
      });
    }
  } catch (error) {
    console.error("❌ Error fetching subscription plans:", error);
  } finally {
    process.exit(0);
  }
}

fetchAllSubscriptions();
