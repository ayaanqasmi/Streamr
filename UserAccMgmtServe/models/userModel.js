import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    storageUsed: { type: Number, default: 0 },
    dailyBandwidthUsed: { type: Number, default: 0 },
    accountStatus: {
      type: String,
      enum: ["active", "restricted"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);