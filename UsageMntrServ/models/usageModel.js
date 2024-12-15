import mongoose from "mongoose";

const usageSchema = new mongoose.Schema(
  {
    date: { type: Date, default: Date.now, unique: true },
    totalDataUsed: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Usage", usageSchema);