// src/models/Subscription.js
import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: String, required: true },
  includesCardio: { type: Boolean, required: true },
  features: [String], // e.g., ["Gym Access", "Trainer Support"]
});

const Subscription =
  mongoose.models.Subscription ||
  mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
