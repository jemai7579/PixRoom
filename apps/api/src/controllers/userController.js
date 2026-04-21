import { User } from "../models/User.js";
import { getPlanFeatures } from "../services/subscriptionService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const updateProfile = asyncHandler(async (req, res) => {
  const {
    name,
    city,
    location,
    phone,
    bio,
    specialties,
    displayName,
    priceRange,
    portfolioImages,
    rating,
    reviewCount,
    isAvailable,
    profilePhoto,
    servicePackages,
    availabilityLabel,
    bookingPreferences,
    communicationPreferences,
  } = req.body;

  const user = await User.findById(req.user._id);

  if (name) {
    user.name = name.trim();
  }

  if (user.role === "photographer") {
    user.photographerProfile = {
      ...user.photographerProfile?.toObject?.(),
      displayName: displayName ?? user.photographerProfile.displayName ?? user.name,
      city: city ?? user.photographerProfile.city,
      location: location ?? city ?? user.photographerProfile.location ?? user.photographerProfile.city,
      phone: phone ?? user.photographerProfile.phone,
      bio: bio ?? user.photographerProfile.bio,
      specialties: Array.isArray(specialties)
        ? specialties
        : typeof specialties === "string"
          ? specialties
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : user.photographerProfile.specialties,
      priceRange: priceRange ?? user.photographerProfile.priceRange,
      portfolioImages: Array.isArray(portfolioImages)
        ? portfolioImages.filter(Boolean)
        : user.photographerProfile.portfolioImages,
      rating:
        typeof rating === "number" && !Number.isNaN(rating)
          ? rating
          : user.photographerProfile.rating,
      reviewCount:
        typeof reviewCount === "number" && !Number.isNaN(reviewCount)
          ? reviewCount
          : user.photographerProfile.reviewCount,
      isAvailable:
        typeof isAvailable === "boolean" ? isAvailable : user.photographerProfile.isAvailable,
      servicePackages: Array.isArray(servicePackages)
        ? servicePackages.filter(Boolean)
        : typeof servicePackages === "string"
          ? servicePackages
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : user.photographerProfile.servicePackages,
      availabilityLabel: availabilityLabel ?? user.photographerProfile.availabilityLabel,
      bookingPreferences: bookingPreferences ?? user.photographerProfile.bookingPreferences,
      communicationPreferences:
        communicationPreferences ?? user.photographerProfile.communicationPreferences,
      profilePhoto: profilePhoto ?? user.photographerProfile.profilePhoto,
    };
  }

  await user.save();

  res.json({
    message: "Profile updated successfully.",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      subscriptionPlan: user.subscriptionPlan,
      subscriptionStatus: user.subscriptionStatus,
      trialEndsAt: user.trialEndsAt,
      photographerProfile: {
        ...user.photographerProfile,
        displayName: user.photographerProfile?.displayName || user.name,
        location: user.photographerProfile?.location || user.photographerProfile?.city || "",
        city: user.photographerProfile?.city || user.photographerProfile?.location || "",
        servicePackages: user.photographerProfile?.servicePackages || [],
        availabilityLabel:
          user.photographerProfile?.availabilityLabel || "Available for new bookings",
        bookingPreferences: user.photographerProfile?.bookingPreferences || "",
        communicationPreferences: user.photographerProfile?.communicationPreferences || "",
      },
      features: getPlanFeatures(user),
    },
  });
});
