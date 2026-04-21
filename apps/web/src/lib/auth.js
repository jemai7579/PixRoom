const TOKEN_KEY = "pixroom_token";

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function storeToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getPostAuthRoute(user) {
  if (user.role === "photographer") {
    return "/app/marketplace";
  }

  if (user.subscriptionPlan === "premium") {
    return "/app/billing";
  }

  return "/app/dashboard";
}
