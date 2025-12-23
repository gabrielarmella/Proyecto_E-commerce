import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    tokenHash: { type: String, required: true, index: true }, // hash del refresh
    expiresAt: { type: Date, required: true, index: true },
    revokedAt: { type: Date },
    replacedByToken: { type: String }, 
    userAgent: { type: String },
    ip: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("RefreshToken", refreshTokenSchema);