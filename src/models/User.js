import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minlenght: 2,
      maxlength: 80,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[\s@]+$/,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    currentSubscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      default: null,
    },
  },
  { timestamps: true }
);
UserSchema.index({ email: 1 }, { unique: true });
export default mongoose.models.User || mongoose.model("User", UserSchema);
