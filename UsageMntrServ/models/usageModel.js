import mongoose from "mongoose";

const usageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    date: { type: Date, default: Date.now },
    dataUsed: { type: Number, default: 0 }, // in MB
  },
  { timestamps: true }
);

export default mongoose.model("Usage", usageSchema);