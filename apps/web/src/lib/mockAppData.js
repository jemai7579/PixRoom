const planLabels = {
  free: "Starter",
  premium: "Premium",
  photographer: "Photographer Pro",
};

const roleLabels = {
  user: "Member",
  photographer: "Photographer",
  admin: "Workspace owner",
};

const subscriptionLabels = {
  active: "Active",
  trial: "Trial",
  inactive: "Needs attention",
};

export const mockUser = {
  fullName: "Hamza Jemai",
  email: "hamza@pixroom.ai",
  avatar: "",
  plan: "Photographer Pro",
  billingStatus: "Active",
  companyName: "PixRoom Studio",
  companyEmail: "hello@pixroom.ai",
  phone: "+216 20 555 778",
  address: "Lac 1, Tunis, Tunisia",
  role: "photographer",
};

export function buildAppUser(user) {
  const photographerProfile = user?.photographerProfile || {};
  const fullName = user?.fullName || user?.name || mockUser.fullName;
  const email = user?.email || mockUser.email;
  const plan = planLabels[user?.subscriptionPlan] || user?.plan || mockUser.plan;
  const billingStatus =
    subscriptionLabels[user?.subscriptionStatus] || user?.billingStatus || mockUser.billingStatus;
  const role = user?.role || mockUser.role;

  return {
    fullName,
    firstName: fullName.split(" ")[0] || fullName,
    email,
    avatar: photographerProfile.profilePhoto || user?.avatar || mockUser.avatar,
    plan,
    billingStatus,
    companyName: user?.companyName || mockUser.companyName,
    companyEmail: user?.companyEmail || email,
    phone: photographerProfile.phone || mockUser.phone,
    address: photographerProfile.location || user?.address || mockUser.address,
    role,
    roleLabel: roleLabels[role] || "Member",
    displayName: photographerProfile.displayName || fullName,
    bio: photographerProfile.bio || "",
    location: photographerProfile.location || photographerProfile.city || "",
    specialties: photographerProfile.specialties || [],
    priceRange: photographerProfile.priceRange || "",
    portfolioImages: photographerProfile.portfolioImages || [],
    rating: photographerProfile.rating || 0,
    reviewCount: photographerProfile.reviewCount || 0,
    servicePackages: photographerProfile.servicePackages || [],
    isAvailable: photographerProfile.isAvailable ?? true,
    availabilityLabel: photographerProfile.availabilityLabel || "Available for new bookings",
    bookingPreferences: photographerProfile.bookingPreferences || "",
    communicationPreferences: photographerProfile.communicationPreferences || "",
    canUseAssistant: Boolean(
      user?.features?.canUseAssistant || user?.subscriptionPlan === "premium" || user?.subscriptionPlan === "photographer" || plan !== "Starter",
    ),
    initials: fullName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
  };
}

export function buildDashboardData(appUser, liveDashboard) {
  const stats = {
    roomsCount: liveDashboard?.stats?.roomsCount ?? 12,
    uploadsCount: liveDashboard?.stats?.uploadsCount ?? 2846,
    pendingInvites: liveDashboard?.stats?.pendingInvites ?? 18,
    storageUsedGb: liveDashboard?.stats?.storageUsedGb ?? 182,
  };

  return {
    workspaceScore: "92%",
    stats: [
      {
        key: "rooms",
        label: "Active rooms",
        value: stats.roomsCount,
        change: "+3 rooms this week",
        tone: "emerald",
      },
      {
        key: "uploads",
        label: "Recent uploads",
        value: stats.uploadsCount.toLocaleString(),
        change: "+341 new photos this week",
        tone: "sky",
      },
      {
        key: "invites",
        label: "Pending invitations",
        value: stats.pendingInvites,
        change: "6 waiting for approval",
        tone: "violet",
      },
      {
        key: "storage",
        label: "Storage used",
        value: `${stats.storageUsedGb} GB`,
        change: "73% of Premium capacity",
        tone: "amber",
      },
    ],
    highlights: [
      { label: "Private rooms", value: "7 enabled" },
      { label: "Shared galleries", value: "18 live" },
      { label: "Review time", value: "4 min avg" },
    ],
    latestRooms:
      liveDashboard?.rooms?.map((room, index) => ({
        id: room.id,
        name: room.name,
        type: room.eventType || "Event room",
        status: room.visibility === "private" ? "Private" : "Live",
        participants: room.membersCount ?? 18 + index * 4,
        uploads: room.uploadsCount ?? room.uploads?.length ?? 120 + index * 36,
        visibility: room.visibility === "private" ? "Private gallery" : "Public join link",
        code: room.code || `PX-${8210 + index}`,
        updatedAt: room.updatedAt ? new Date(room.updatedAt).toLocaleDateString() : `${index + 1}h ago`,
        href: `/app/rooms/${room.id}`,
      })) ?? [
        {
          id: "room-1",
          name: "Sofitel Launch Party",
          type: "Brand activation",
          status: "Live",
          participants: 42,
          uploads: 618,
          visibility: "Public join link",
          code: "PX-8210",
          updatedAt: "12 min ago",
          href: "/app/rooms",
        },
        {
          id: "room-2",
          name: "Yasmine Wedding Weekend",
          type: "Wedding gallery",
          status: "Private",
          participants: 28,
          uploads: 392,
          visibility: "Private gallery",
          code: "PX-9124",
          updatedAt: "45 min ago",
          href: "/app/rooms",
        },
        {
          id: "room-3",
          name: "Summit VIP Lounge",
          type: "Corporate event",
          status: "Live",
          participants: 67,
          uploads: 1048,
          visibility: "Guest upload enabled",
          code: "PX-7743",
          updatedAt: "2h ago",
          href: "/app/rooms",
        },
      ],
    recentUploads: [
      {
        title: "Cocktail entrance portraits",
        room: "Sofitel Launch Party",
        author: appUser.role === "photographer" ? appUser.fullName : "Sarah Ben Hassen",
        time: "8 min ago",
        visibility: "Shared with guests",
      },
      {
        title: "Wedding ceremony highlights",
        room: "Yasmine Wedding Weekend",
        author: "Youssef Ben Ali",
        time: "24 min ago",
        visibility: "Private review only",
      },
      {
        title: "VIP lounge photo set",
        room: "Summit VIP Lounge",
        author: "Client uploads",
        time: "1h ago",
        visibility: "Team only",
      },
    ],
    invitations: [
      { name: "Mouna Trabelsi", room: "Yasmine Wedding Weekend", role: "Client", status: "Awaiting response" },
      { name: "Rania Gharbi", room: "Sofitel Launch Party", role: "Guest uploader", status: "Accepted" },
      { name: "Omar Mhiri", room: "Summit VIP Lounge", role: "Photographer", status: "Needs resend" },
    ],
    activity: [
      { title: "Guest uploads enabled", detail: "Sofitel Launch Party now accepts mobile uploads.", time: "15 min ago" },
      { title: "Gallery shared", detail: "Private preview sent to the Yasmine Wedding client.", time: "43 min ago" },
      { title: "Room privacy updated", detail: "Summit VIP Lounge changed from public to invite-only.", time: "2h ago" },
    ],
    storage: {
      used: "182 GB",
      total: "250 GB",
      uploadsThisWeek: "341 photos",
      sharedGalleries: "18 live galleries",
    },
    roles: {
      member: [
        "Join invited rooms and shared galleries.",
        "Upload photos when a room allows guest uploads.",
        "Review invitations and manage your profile.",
      ],
      photographer: [
        "Create rooms, manage privacy, and deliver collections.",
        "Invite clients, guests, and collaborators into each room.",
        "Access premium tools for branding, AI help, and higher storage.",
      ],
    },
    subscription: {
      plan: appUser.plan,
      status: appUser.billingStatus,
      privateRooms: appUser.plan === "Starter" ? "Upgrade required" : "Included",
      assistant: appUser.canUseAssistant ? "Included" : "Upgrade required",
    },
    team: {
      usedSeats: 4,
      totalSeats: 8,
      members: [
        { name: appUser.fullName, email: appUser.email, role: "Owner", status: "Online" },
        { name: "Ameni Triki", email: "ameni@pixroom.ai", role: "Client success", status: "Reviewing invites" },
        { name: "Youssef Ben Ali", email: "youssef@pixroom.ai", role: "Photographer ops", status: "Uploading" },
      ],
    },
  };
}

export const userSettingsTabs = [
  { id: "profile", label: "Profile" },
  { id: "security", label: "Security" },
  { id: "invitations", label: "Invitations" },
  { id: "privacy", label: "Friends & privacy" },
  { id: "subscription", label: "Subscription" },
];

export const photographerSettingsTabs = [
  { id: "profile", label: "Photographer profile" },
  { id: "portfolio", label: "Portfolio visibility" },
  { id: "services", label: "Services & pricing" },
  { id: "availability", label: "Availability" },
  { id: "booking", label: "Booking preferences" },
  { id: "communication", label: "Communication" },
  { id: "security", label: "Security" },
  { id: "subscription", label: "Subscription" },
];
