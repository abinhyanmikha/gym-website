// models/Payment.js
import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  subscriptionName: {
    type: String,
    required: true,
  },
  subscriptionId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  refId: {
    type: String,
    required: true,
    unique: true, // each eSewa transaction has a unique reference
  },
  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
