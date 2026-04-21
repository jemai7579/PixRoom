import { User } from "../models/User.js";
import { getPlanFeatures, resolveSubscription } from "../services/subscriptionService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/appError.js";

export const getBillingSummary = asyncHandler(async (req, res) => {
  res.json({
    subscription: {
      plan: req.user.subscriptionPlan,
      status: req.user.subscriptionStatus,
      trialEndsAt: req.user.trialEndsAt,
      features: getPlanFeatures(req.user),
    },
  });
});

export const selectPlan = asyncHandler(async (req, res) => {
  const { plan } = req.body;

  if (!["free", "premium", "photographer"].includes(plan)) {
    throw new AppError("Invalid plan selection.");
  }

  const nextRole = plan === "photographer" ? "photographer" : req.user.role === "photographer" ? "photographer" : "user";
  const subscription = resolveSubscription(nextRole, plan);

  const user = await User.findById(req.user._id);
  user.role = subscription.role;
  user.subscriptionPlan = subscription.subscriptionPlan;
  user.subscriptionStatus = subscription.subscriptionStatus;
  user.trialEndsAt = subscription.trialEndsAt;
  await user.save();

  res.json({
    message: "Plan updated successfully.",
    subscription: {
      plan: user.subscriptionPlan,
      status: user.subscriptionStatus,
      trialEndsAt: user.trialEndsAt,
      features: getPlanFeatures(user),
    },
  });
});
