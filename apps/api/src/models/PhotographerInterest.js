import mongoose from "mongoose";

const photographerInterestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    photographer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      enum: ["liked", "skipped", "saved"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

photographerInterestSchema.index({ user: 1, photographer: 1 }, { unique: true });

export const PhotographerInterest = mongoose.model("PhotographerInterest", photographerInterestSchema);
