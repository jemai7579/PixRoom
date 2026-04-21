import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/appError.js";
import { signToken } from "../utils/auth.js";
import { getPlanFeatures, resolveSubscription } from "../services/subscriptionService.js";

function sanitizeUser(user) {
  const photographerProfile = user.photographerProfile || {};

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    subscriptionPlan: user.subscriptionPlan,
    subscriptionStatus: user.subscriptionStatus,
    trialEndsAt: user.trialEndsAt,
    photographerProfile: {
      ...photographerProfile,
      displayName: photographerProfile.displayName || user.name,
      location: photographerProfile.location || photographerProfile.city || "",
      city: photographerProfile.city || photographerProfile.location || "",
      servicePackages: photographerProfile.servicePackages || [],
      availabilityLabel: photographerProfile.availabilityLabel || "Available for new bookings",
      bookingPreferences: photographerProfile.bookingPreferences || "",
      communicationPreferences: photographerProfile.communicationPreferences || "",
    },
    features: getPlanFeatures(user),
  };
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role = "user", plan = "free" } = req.body;

  if (!name || !email || !password) {
    throw new AppError("Name, email, and password are required.");
  }

  if (password.length < 6) {
    throw new AppError("Password must be at least 6 characters.");
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new AppError("An account with this email already exists.", 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const subscription = resolveSubscription(role, plan);

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    role: subscription.role,
    subscriptionPlan: subscription.subscriptionPlan,
    subscriptionStatus: subscription.subscriptionStatus,
    trialEndsAt: subscription.trialEndsAt,
  });

  const token = signToken(user._id.toString());

  res.status(201).json({
    message: "Account created successfully.",
    token,
    user: sanitizeUser(user),
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Email and password are required.");
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });

  if (!user) {
    throw new AppError("Invalid email or password.", 401);
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    throw new AppError("Invalid email or password.", 401);
  }

  const token = signToken(user._id.toString());

  res.json({
    message: "Logged in successfully.",
    token,
    user: sanitizeUser(user),
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.json({
    user: sanitizeUser(user),
  });
});
