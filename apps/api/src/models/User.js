import mongoose from "mongoose";

const photographerProfileSchema = new mongoose.Schema(
  {
    displayName: {
      type: String,
      trim: true,
      default: "",
    },
    bio: {
      type: String,
      trim: true,
      default: "",
    },
    profilePhoto: {
      type: String,
      trim: true,
      default: "",
    },
    city: {
      type: String,
      trim: true,
      default: "",
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    specialties: {
      type: [String],
      default: [],
    },
    priceRange: {
      type: String,
      trim: true,
      default: "",
    },
    portfolioImages: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviewCount: {
      type: Number,
      min: 0,
      default: 0,
    },
    servicePackages: {
      type: [String],
      default: [],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    availabilityLabel: {
      type: String,
      trim: true,
      default: "Available for new bookings",
    },
    bookingPreferences: {
      type: String,
      trim: true,
      default: "",
    },
    communicationPreferences: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "photographer"],
      default: "user",
    },
    subscriptionPlan: {
      type: String,
      enum: ["free", "premium", "photographer"],
      default: "free",
    },
    subscriptionStatus: {
      type: String,
      enum: ["inactive", "active", "trial"],
      default: "inactive",
    },
    trialEndsAt: Date,
    photographerProfile: {
      type: photographerProfileSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model("User", userSchema);
