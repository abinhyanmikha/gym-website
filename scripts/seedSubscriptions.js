import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../src/lib/mongodb.js";

// Define the Subscription schema directly in this script
const subscriptionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: String, required: true },
  includesCardio: { type: Boolean, required: true },
  features: [String],
});

// Create the model
const Subscription = mongoose.models.Subscription || mongoose.model("Subscription", subscriptionSchema);

async function seedSubscriptions() {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Clear existing subscriptions
    await Subscription.deleteMany({});
    
    // Sample subscription plans
    const subscriptions = [
      {
        name: "Basic Plan",
        price: 1500,
        duration: "1 Month",
        includesCardio: false,
        features: ["Access to gym equipment", "Locker access", "Basic fitness assessment"]
      },
      {
        name: "Standard Plan",
        price: 2500,
        duration: "1 Month",
        includesCardio: true,
        features: ["Access to gym equipment", "Cardio sessions", "Locker access", "Monthly fitness assessment"]
      },
      {
        name: "Premium Plan",
        price: 4000,
        duration: "1 Month",
        includesCardio: true,
        features: ["24/7 gym access", "Unlimited cardio sessions", "Personal trainer (2 sessions/week)", "Nutrition consultation", "Premium locker access"]
      }
    ];
    
    // Insert the sample subscriptions
    await Subscription.insertMany(subscriptions);
    
    console.log("✅ Sample subscription plans added successfully!");
    
    // Verify the subscriptions were added
    const plans = await Subscription.find();
    console.log(`Total plans in database: ${plans.length}`);
    plans.forEach((plan, index) => {
      console.log(`${index + 1}. ${plan.name} - Rs. ${plan.price}/${plan.duration}`);
    });
    
  } catch (error) {
    console.error("❌ Error seeding subscriptions:", error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
    process.exit(0);
  }
}

// Run the seed function
seedSubscriptions();