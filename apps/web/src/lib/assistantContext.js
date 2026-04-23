export function getAssistantSuggestions(pathname, userRole) {
  if (pathname.startsWith("/app/rooms/") && pathname !== "/app/rooms/new") {
    return [
      "How do I upload photos?",
      "How do I download selected photos?",
      "How do I manage room invitations?",
    ];
  }

  if (
    userRole === "photographer" &&
    (pathname.startsWith("/app/dashboard") ||
      pathname.startsWith("/app/requests") ||
      pathname.startsWith("/app/portfolio") ||
      pathname.startsWith("/app/availability") ||
      pathname.startsWith("/app/services"))
  ) {
    return [
      "How do I accept a room invitation?",
      "How do I reject a room invitation?",
      "How do I manage my portfolio?",
    ];
  }

  if (pathname.startsWith("/app/photographers")) {
    return [
      "How do I browse photographers?",
      "How do I contact a photographer?",
      "How do I invite a photographer to a room?",
    ];
  }

  if (pathname.startsWith("/app/friends")) {
    return [
      "How do I invite people?",
      "Why do I need accepted friends for room invites?",
      "How do I manage friend requests?",
    ];
  }

  if (pathname.startsWith("/app/settings")) {
    return [
      "What does my current plan include?",
      "How do I manage room privacy?",
      "How do I update my profile?",
    ];
  }

  return [
    "How do I create a room?",
    "How do I invite friends?",
    "How do I invite a photographer?",
    "How do I download photos?",
  ];
}

export function buildAssistantPayload(message, { currentPage, user, appUser } = {}) {
  return {
    message,
    currentPage:
      currentPage ||
      (typeof window !== "undefined" ? window.location.pathname : "Not provided"),
    userRole: user?.role || appUser?.role || "",
    userPlan: user?.subscriptionPlan || appUser?.plan || "",
  };
}
