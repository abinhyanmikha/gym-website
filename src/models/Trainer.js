import mongoose from "mongoose";

const TrainerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Trainer ||
  mongoose.model("Trainer", TrainerSchema);
