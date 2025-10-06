import mongoose from "mongoose";

const UserSubscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plan: {
      type: String,
      required: true, // e.g., "monthly", "yearly", etc.
    },
    amount: {
      type: Number,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true, // Esewa refId
    },
    status: {
      type: String,
      enum: ["active", "pending", "failed"],
      default: "active",
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.models.UserSubscription ||
  mongoose.model("UserSubscription", UserSubscriptionSchema);
