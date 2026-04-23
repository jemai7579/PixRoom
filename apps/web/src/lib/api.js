const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const API_ORIGIN = API_BASE_URL.replace(/\/api$/, "");

export function getAssetUrl(path) {
  if (!path) {
    return "";
  }

  if (path.startsWith("http")) {
    return path;
  }

  return `${API_ORIGIN}${path}`;
}

async function request(path, options = {}) {
  const {
    token,
    body,
    headers = {},
    isFormData = false,
    ...rest
  } = options;

  const finalHeaders = new Headers(headers);

  if (token) {
    finalHeaders.set("Authorization", `Bearer ${token}`);
  }

  if (!isFormData) {
    finalHeaders.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
}

function getDownloadFilename(response, fallbackName) {
  const disposition = response.headers.get("Content-Disposition") || "";
  const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);

  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]);
  }

  const plainMatch = disposition.match(/filename="?([^"]+)"?/i);
  return plainMatch?.[1] || fallbackName;
}

export async function downloadFromApi(path, { fallbackName, token } = {}) {
  const headers = new Headers();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "Download failed.");
  }

  const blob = await response.blob();
  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = blobUrl;
  link.download = getDownloadFilename(response, fallbackName || "download");
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(blobUrl);
}

function buildQuery(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    searchParams.set(key, value);
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export const api = {
  auth: {
    register(payload) {
      return request("/auth/register", { method: "POST", body: payload });
    },
    login(payload) {
      return request("/auth/login", { method: "POST", body: payload });
    },
    me(token) {
      return request("/auth/me", { token });
    },
  },
  rooms: {
    dashboard(token) {
      return request("/rooms/dashboard", { token });
    },
    list(token) {
      return request("/rooms", { token });
    },
    create(token, payload) {
      return request("/rooms", { method: "POST", token, body: payload });
    },
    get(token, roomId) {
      return request(`/rooms/${roomId}`, { token });
    },
    listInvitations(token) {
      return request("/rooms/invitations/mine", { token });
    },
    listRoomInvitations(token, roomId) {
      return request(`/rooms/${roomId}/invitations`, { token });
    },
    inviteFriend(token, roomId, inviteeId) {
      return request(`/rooms/${roomId}/invitations`, {
        method: "POST",
        token,
        body: { inviteeId },
      });
    },
    invitePhotographer(token, roomId, photographerId) {
      return request(`/rooms/${roomId}/invite-photographer`, {
        method: "POST",
        token,
        body: { photographerId },
      });
    },
    acceptInvitation(token, invitationId) {
      return request(`/rooms/invitations/${invitationId}/accept`, { method: "POST", token });
    },
    rejectInvitation(token, invitationId) {
      return request(`/rooms/invitations/${invitationId}/reject`, { method: "POST", token });
    },
    join(token, code) {
      return request("/rooms/join", { method: "POST", token, body: { code } });
    },
    upload(token, roomId, file) {
      const formData = new FormData();
      formData.append("photo", file);
      return request(`/rooms/${roomId}/uploads`, {
        method: "POST",
        token,
        body: formData,
        isFormData: true,
      });
    },
    addComment(token, roomId, message) {
      return request(`/rooms/${roomId}/comments`, {
        method: "POST",
        token,
        body: { message },
      });
    },
    downloadPhoto(token, photoId, fallbackName) {
      return downloadFromApi(`/rooms/photos/${photoId}/download`, {
        token,
        fallbackName,
      });
    },
    downloadRoomPhotos(token, roomId, options = {}) {
      const query = buildQuery({
        photoIds: options.photoIds?.length ? options.photoIds.join(",") : undefined,
      });

      return downloadFromApi(`/rooms/${roomId}/download${query}`, {
        token,
        fallbackName: options.fallbackName || "pixroom-room-photos.zip",
      });
    },
  },
  users: {
    updateProfile(token, payload) {
      return request("/users/profile", { method: "PATCH", token, body: payload });
    },
  },
  social: {
    searchUsers(token, query) {
      return request(`/social/users/search${buildQuery({ q: query })}`, { token });
    },
    overview(token) {
      return request("/social/friendships", { token });
    },
    sendFriendRequest(token, receiverId) {
      return request("/social/friend-requests", {
        method: "POST",
        token,
        body: { receiverId },
      });
    },
    acceptFriendRequest(token, requestId) {
      return request(`/social/friend-requests/${requestId}/accept`, { method: "POST", token });
    },
    rejectFriendRequest(token, requestId) {
      return request(`/social/friend-requests/${requestId}/reject`, { method: "POST", token });
    },
    cancelFriendRequest(token, requestId) {
      return request(`/social/friend-requests/${requestId}/cancel`, { method: "POST", token });
    },
  },
  billing: {
    summary(token) {
      return request("/billing/summary", { token });
    },
    selectPlan(token, plan) {
      return request("/billing/select-plan", { method: "POST", token, body: { plan } });
    },
  },
  marketplace: {
    listPhotographers(token, filters = {}) {
      return request(`/marketplace/photographers${buildQuery(filters)}`, { token });
    },
    listSaved(token) {
      return request("/marketplace/saved", { token });
    },
    listSkipped(token) {
      return request("/marketplace/skipped", { token });
    },
    listBookingRequests(token) {
      return request("/marketplace/booking-requests", { token });
    },
    updateBookingRequestStatus(token, requestId, status) {
      return request(`/marketplace/booking-requests/${requestId}/status`, {
        method: "PATCH",
        token,
        body: { status },
      });
    },
    updateInterest(token, photographerId, action) {
      return request(`/marketplace/photographers/${photographerId}/interest`, {
        method: "POST",
        token,
        body: { action },
      });
    },
    undoInterest(token, photographerId) {
      return request("/marketplace/photographers/actions/undo", {
        method: "POST",
        token,
        body: photographerId ? { photographerId } : {},
      });
    },
    resetSkipped(token) {
      return request("/marketplace/photographers/skipped/reset", {
        method: "POST",
        token,
      });
    },
    requestBooking(token, photographerId, payload) {
      return request(`/marketplace/photographers/${photographerId}/booking-requests`, {
        method: "POST",
        token,
        body: payload,
      });
    },
  },
  photographer: {
    listInvitations(token) {
      return request("/photographer/invitations", { token });
    },
  },
  invitations: {
    accept(token, invitationId) {
      return request(`/invitations/${invitationId}/accept`, { method: "POST", token });
    },
    reject(token, invitationId) {
      return request(`/invitations/${invitationId}/reject`, { method: "POST", token });
    },
  },
  assistant: {
    chat(token, payload) {
      const body = typeof payload === "string" ? { message: payload } : payload;
      return request("/assistant/chat", { method: "POST", token, body });
    },
  },
};
