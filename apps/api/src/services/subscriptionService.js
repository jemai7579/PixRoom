export function getPlanFeatures(user) {
  const plan = user.subscriptionPlan;
  const isPremium = plan === "premium" || plan === "photographer";

  return {
    plan,
    isPremium,
    canUseAssistant: isPremium,
    canCreatePrivateRooms: isPremium,
    roomLimit: plan === "free" ? 8 : null,
  };
}

export function resolveSubscription(role, requestedPlan) {
  if (role === "photographer" || requestedPlan === "photographer") {
    return {
      role: "photographer",
      subscriptionPlan: "photographer",
      subscriptionStatus: "trial",
      trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };
  }

  if (requestedPlan === "premium") {
    return {
      role: "user",
      subscriptionPlan: "premium",
      subscriptionStatus: "active",
      trialEndsAt: null,
    };
  }

  return {
    role: "user",
    subscriptionPlan: "free",
    subscriptionStatus: "inactive",
    trialEndsAt: null,
  };
}
