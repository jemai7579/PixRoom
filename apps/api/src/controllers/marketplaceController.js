import { User } from "../models/User.js";
import { BookingRequest } from "../models/BookingRequest.js";
import { PhotographerInterest } from "../models/PhotographerInterest.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/appError.js";

function serializePhotographer(photographer, interest = null) {
  const profile = photographer.photographerProfile || {};

  return {
    id: photographer._id,
    name: profile.displayName || photographer.name,
    userName: photographer.name,
    email: photographer.email,
    profilePhoto: profile.profilePhoto || "",
    city: profile.city || profile.location || "",
    location: profile.location || profile.city || "",
    phone: profile.phone || "",
    bio: profile.bio || "",
    specialties: profile.specialties || [],
    priceRange: profile.priceRange || "",
    portfolioImages: profile.portfolioImages || [],
    rating: profile.rating || 0,
    reviewCount: profile.reviewCount || 0,
    servicePackages: profile.servicePackages || [],
    isAvailable: profile.isAvailable ?? true,
    availabilityLabel: profile.availabilityLabel || "Available for new bookings",
    bookingPreferences: profile.bookingPreferences || "",
    communicationPreferences: profile.communicationPreferences || "",
    subscriptionPlan: photographer.subscriptionPlan,
    joinedAt: photographer.createdAt,
    interest,
  };
}

function serializeInterest(interest) {
  return {
    id: interest._id,
    action: interest.action,
    photographer: serializePhotographer(interest.photographer, interest.action),
    createdAt: interest.createdAt,
    updatedAt: interest.updatedAt,
  };
}

export const listPhotographers = asyncHandler(async (req, res) => {
  const filters = {
    role: "photographer",
  };
  const { location, eventType, budget, rating, availability, excludeAction } = req.query;

  if (location?.trim()) {
    filters.$or = [
      { "photographerProfile.location": { $regex: location.trim(), $options: "i" } },
      { "photographerProfile.city": { $regex: location.trim(), $options: "i" } },
    ];
  }

  if (eventType?.trim()) {
    filters["photographerProfile.specialties"] = {
      $elemMatch: { $regex: eventType.trim(), $options: "i" },
    };
  }

  if (budget?.trim()) {
    filters["photographerProfile.priceRange"] = {
      $regex: budget.trim(),
      $options: "i",
    };
  }

  if (rating) {
    filters["photographerProfile.rating"] = { $gte: Number(rating) || 0 };
  }

  if (availability === "available") {
    filters["photographerProfile.isAvailable"] = true;
  }

  let excludedPhotographerIds = [];

  if (req.user && excludeAction?.trim()) {
    const interests = await PhotographerInterest.find({
      user: req.user._id,
      action: excludeAction,
    }).select("photographer");
    excludedPhotographerIds = interests.map((interest) => interest.photographer);
  }

  if (excludedPhotographerIds.length) {
    filters._id = { $nin: excludedPhotographerIds };
  }

  const photographers = await User.find(filters)
    .select("name email photographerProfile createdAt subscriptionPlan")
    .sort({ "photographerProfile.rating": -1, createdAt: -1 });

  let interestMap = new Map();

  if (req.user) {
    const interests = await PhotographerInterest.find({
      user: req.user._id,
      photographer: { $in: photographers.map((photographer) => photographer._id) },
    }).select("photographer action");

    interestMap = new Map(
      interests.map((interest) => [interest.photographer.toString(), interest.action]),
    );
  }

  res.json({
    photographers: photographers.map((photographer) =>
      serializePhotographer(photographer, interestMap.get(photographer._id.toString()) || null),
    ),
  });
});

export const savePhotographerInterest = asyncHandler(async (req, res) => {
  const { action } = req.body;
  const photographer = await User.findOne({
    _id: req.params.photographerId,
    role: "photographer",
  }).select("name email photographerProfile createdAt subscriptionPlan");

  if (!["liked", "skipped", "saved"].includes(action)) {
    throw new AppError("Choose a valid photographer action.");
  }

  if (!photographer) {
    throw new AppError("Photographer not found.", 404);
  }

  const interest = await PhotographerInterest.findOneAndUpdate(
    {
      user: req.user._id,
      photographer: photographer._id,
    },
    {
      $set: {
        action,
      },
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    },
  );

  res.json({
    message: `Photographer ${action === "skipped" ? "skipped" : "saved"} successfully.`,
    photographer: serializePhotographer(photographer, interest.action),
  });
});

export const undoPhotographerInterest = asyncHandler(async (req, res) => {
  const { photographerId } = req.body;

  const query = photographerId
    ? { user: req.user._id, photographer: photographerId }
    : { user: req.user._id };

  const interest = await PhotographerInterest.findOne(query)
    .populate("photographer", "name email photographerProfile createdAt subscriptionPlan")
    .sort({ updatedAt: -1 });

  if (!interest) {
    throw new AppError("No photographer action is available to undo.", 404);
  }

  const photographer = interest.photographer;
  const undoneAction = interest.action;
  await PhotographerInterest.findByIdAndDelete(interest._id);

  res.json({
    message: "Last photographer action undone.",
    undoneAction,
    photographer: serializePhotographer(photographer, null),
  });
});

export const resetSkippedPhotographers = asyncHandler(async (req, res) => {
  const skipped = await PhotographerInterest.find({
    user: req.user._id,
    action: "skipped",
  })
    .populate("photographer", "name email photographerProfile createdAt subscriptionPlan")
    .sort({ updatedAt: -1 });

  if (!skipped.length) {
    return res.json({
      message: "There are no skipped photographers to reset.",
      photographers: [],
    });
  }

  await PhotographerInterest.deleteMany({
    user: req.user._id,
    action: "skipped",
  });

  res.json({
    message: "Skipped photographers reset successfully.",
    photographers: skipped.map((interest) => serializePhotographer(interest.photographer, null)),
  });
});

export const listSkippedPhotographers = asyncHandler(async (req, res) => {
  const skipped = await PhotographerInterest.find({
    user: req.user._id,
    action: "skipped",
  })
    .populate("photographer", "name email photographerProfile createdAt subscriptionPlan")
    .sort({ updatedAt: -1 });

  res.json({
    skipped: skipped.map((interest) => serializeInterest(interest)),
  });
});

export const listSavedPhotographers = asyncHandler(async (req, res) => {
  const saved = await PhotographerInterest.find({
    user: req.user._id,
    action: { $in: ["liked", "saved"] },
  })
    .populate("photographer", "name email photographerProfile createdAt subscriptionPlan")
    .sort({ updatedAt: -1 });

  res.json({
    photographers: saved.map((interest) =>
      serializePhotographer(interest.photographer, interest.action),
    ),
  });
});

export const createBookingRequest = asyncHandler(async (req, res) => {
  const { eventType, eventDate, location, message } = req.body;
  const photographer = await User.findOne({
    _id: req.params.photographerId,
    role: "photographer",
  }).select("name email photographerProfile");

  if (!photographer) {
    throw new AppError("Photographer not found.", 404);
  }

  if (!eventType?.trim()) {
    throw new AppError("Event type is required.");
  }

  const bookingRequest = await BookingRequest.create({
    client: req.user._id,
    photographer: photographer._id,
    eventType: eventType.trim(),
    eventDate: eventDate || null,
    location: location?.trim() || "",
    message: message?.trim() || "",
  });

  res.status(201).json({
    message: "Booking request sent.",
    bookingRequest: {
      id: bookingRequest._id,
      status: bookingRequest.status,
      eventType: bookingRequest.eventType,
      eventDate: bookingRequest.eventDate,
      location: bookingRequest.location,
      message: bookingRequest.message,
      photographer: {
        id: photographer._id,
        name: photographer.photographerProfile?.displayName || photographer.name,
      },
    },
  });
});

export const listMyBookingRequests = asyncHandler(async (req, res) => {
  const requests = await BookingRequest.find({
    $or: [{ client: req.user._id }, { photographer: req.user._id }],
  })
    .populate("client", "name email")
    .populate("photographer", "name email photographerProfile")
    .sort({ createdAt: -1 });

  res.json({
    bookingRequests: requests.map((request) => ({
      id: request._id,
      status: request.status,
      eventType: request.eventType,
      eventDate: request.eventDate,
      location: request.location,
      message: request.message,
      createdAt: request.createdAt,
      client: request.client
        ? {
            id: request.client._id,
            name: request.client.name,
            email: request.client.email,
          }
        : null,
      photographer: request.photographer
        ? {
            id: request.photographer._id,
            name:
              request.photographer.photographerProfile?.displayName || request.photographer.name,
            email: request.photographer.email,
          }
        : null,
    })),
  });
});

export const updateBookingRequestStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const bookingRequest = await BookingRequest.findById(req.params.requestId)
    .populate("client", "name email")
    .populate("photographer", "name email photographerProfile");

  if (!bookingRequest) {
    throw new AppError("Booking request not found.", 404);
  }

  if (bookingRequest.photographer._id.toString() !== req.user._id.toString()) {
    throw new AppError("Only the photographer can manage this request.", 403);
  }

  if (!["accepted", "rejected", "completed"].includes(status)) {
    throw new AppError("Choose a valid booking request status.");
  }

  bookingRequest.status = status;
  await bookingRequest.save();

  res.json({
    message: `Booking request ${status}.`,
    bookingRequest: {
      id: bookingRequest._id,
      status: bookingRequest.status,
      eventType: bookingRequest.eventType,
      eventDate: bookingRequest.eventDate,
      location: bookingRequest.location,
      message: bookingRequest.message,
      createdAt: bookingRequest.createdAt,
      client: bookingRequest.client
        ? {
            id: bookingRequest.client._id,
            name: bookingRequest.client.name,
            email: bookingRequest.client.email,
          }
        : null,
      photographer: bookingRequest.photographer
        ? {
            id: bookingRequest.photographer._id,
            name:
              bookingRequest.photographer.photographerProfile?.displayName ||
              bookingRequest.photographer.name,
            email: bookingRequest.photographer.email,
          }
        : null,
    },
  });
});
