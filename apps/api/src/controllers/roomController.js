import fs from "node:fs";
import path from "node:path";
import archiver from "archiver";
import { Room } from "../models/Room.js";
import { Friendship } from "../models/Friendship.js";
import { RoomInvitation } from "../models/RoomInvitation.js";
import { User } from "../models/User.js";
import { getPlanFeatures } from "../services/subscriptionService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/appError.js";
import { getMonthWindow, generateRoomCode } from "../utils/room.js";

function serializeRoom(room, userId) {
  const isOwner = room.owner?._id?.toString?.() === userId || room.owner?.toString?.() === userId;
  const adminIds = room.admins?.map((admin) => admin._id?.toString?.() || admin?.toString?.()) || [];
  const memberIds = room.members?.map((member) => member._id?.toString?.() || member?.toString?.()) || [];
  const isAdmin = adminIds.includes(userId);

  return {
    id: room._id,
    name: room.title,
    title: room.title,
    description: room.description,
    eventDate: room.eventDate,
    visibility: room.visibility,
    code: room.code,
    owner: room.owner,
    admins: room.admins || [],
    members: room.members,
    uploads: room.uploads,
    comments: room.comments,
    membersCount: new Set([room.owner?._id?.toString?.() || room.owner?.toString?.(), ...adminIds, ...memberIds].filter(Boolean)).size,
    uploadsCount: room.uploads?.length || 0,
    createdAt: room.createdAt,
    updatedAt: room.updatedAt,
    isOwner,
    isAdmin,
    canManageInvitations: isOwner || isAdmin,
  };
}

function serializeRoomInvitation(invitation, currentUserId) {
  const isInvitee = invitation.invitee?._id?.toString?.() === currentUserId;

  return {
    id: invitation._id,
    status: invitation.status,
    createdAt: invitation.createdAt,
    updatedAt: invitation.updatedAt,
    room: invitation.room
      ? {
          id: invitation.room._id,
          title: invitation.room.title,
          visibility: invitation.room.visibility,
          code: invitation.room.code,
        }
      : null,
    inviter: invitation.inviter
      ? {
          id: invitation.inviter._id,
          name: invitation.inviter.name,
          email: invitation.inviter.email,
        }
      : null,
    invitee: invitation.invitee
      ? {
          id: invitation.invitee._id,
          name: invitation.invitee.name,
          email: invitation.invitee.email,
        }
      : null,
    direction: isInvitee ? "received" : "sent",
  };
}

function sanitizeFilenamePart(value, fallback = "file") {
  const sanitized = String(value || "")
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return sanitized || fallback;
}

function buildDownloadFilename(upload, fallbackPrefix = "pixroom-photo") {
  const originalName = upload.originalName || upload.filename || fallbackPrefix;
  const extension = path.extname(originalName || upload.filename || "") || path.extname(upload.filename || "");
  const baseName = path.basename(originalName, path.extname(originalName || ""));

  return `${sanitizeFilenamePart(baseName, fallbackPrefix)}${extension}`;
}

function createUniqueFilename(name, usedNames) {
  const extension = path.extname(name);
  const baseName = path.basename(name, extension);
  const count = usedNames.get(name) || 0;
  usedNames.set(name, count + 1);

  return count === 0 ? name : `${baseName}-${count + 1}${extension}`;
}

function getUploadFilePath(upload) {
  return path.resolve("uploads", upload.filename);
}

function getPhotoById(room, photoId) {
  return room.uploads.find((upload) => upload._id?.toString() === photoId);
}

async function ensureRoomAccess(roomId, user) {
  const room = await Room.findById(roomId)
    .populate("owner", "name email role")
    .populate("admins", "name email role")
    .populate("members", "name email role")
    .populate("uploads.uploadedBy", "name role")
    .populate("comments.author", "name");

  if (!room) {
    throw new AppError("Room not found.", 404);
  }

  const userId = user._id.toString();
  const memberIds = room.members.map((member) => member._id.toString());
  const adminIds = room.admins.map((admin) => admin._id.toString());
  const ownerId = room.owner._id.toString();
  const canAccess =
    room.visibility === "public" ||
    ownerId === userId ||
    adminIds.includes(userId) ||
    memberIds.includes(userId);

  if (!canAccess) {
    throw new AppError("You do not have access to this room.", 403);
  }

  return room;
}

async function ensureRoomManagementAccess(roomId, user) {
  const room = await Room.findById(roomId)
    .populate("owner", "name email role")
    .populate("admins", "name email role")
    .populate("members", "name email role");

  if (!room) {
    throw new AppError("Room not found.", 404);
  }

  const userId = user._id.toString();
  const ownerId = room.owner._id.toString();
  const adminIds = room.admins.map((admin) => admin._id.toString());

  if (ownerId !== userId && !adminIds.includes(userId)) {
    throw new AppError("Only room owners or admins can invite friends.", 403);
  }

  return room;
}

export const listRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find({
    $or: [{ owner: req.user._id }, { members: req.user._id }],
  })
    .populate("owner", "name email role")
    .sort({ updatedAt: -1 });

  res.json({
    rooms: rooms.map((room) => serializeRoom(room, req.user._id.toString())),
  });
});

export const createRoom = asyncHandler(async (req, res) => {
  const { title, description, eventDate, visibility = "public" } = req.body;

  if (!title?.trim()) {
    throw new AppError("Room title is required.");
  }

  const features = getPlanFeatures(req.user);

  if (visibility === "private" && !features.canCreatePrivateRooms) {
    throw new AppError("Private rooms require a premium or photographer plan.", 403);
  }

  if (features.roomLimit) {
    const { start, end } = getMonthWindow();
    const roomCount = await Room.countDocuments({
      owner: req.user._id,
      createdAt: { $gte: start, $lt: end },
    });

    if (roomCount >= features.roomLimit) {
      throw new AppError("You have reached your monthly free room limit.", 403);
    }
  }

  let code = generateRoomCode();
  while (await Room.findOne({ code })) {
    code = generateRoomCode();
  }

  const room = await Room.create({
    title: title.trim(),
    description: description?.trim() || "",
    eventDate: eventDate || null,
    visibility,
    code,
    owner: req.user._id,
    admins: [],
    members: [],
  });

  const populatedRoom = await Room.findById(room._id).populate("owner", "name email role");

  res.status(201).json({
    message: "Room created successfully.",
    room: serializeRoom(populatedRoom, req.user._id.toString()),
  });
});

export const getRoom = asyncHandler(async (req, res) => {
  const room = await ensureRoomAccess(req.params.roomId, req.user);

  res.json({
    room: serializeRoom(room, req.user._id.toString()),
  });
});

export const joinRoomByCode = asyncHandler(async (req, res) => {
  const { code } = req.body;

  if (!code?.trim()) {
    throw new AppError("Room code is required.");
  }

  const room = await Room.findOne({ code: code.trim().toUpperCase() });

  if (!room) {
    throw new AppError("No room matches this code.", 404);
  }

  const userId = req.user._id.toString();
  const ownerId = room.owner.toString();
  const adminIds = room.admins.map((admin) => admin.toString());
  const memberIds = room.members.map((member) => member.toString());

  if (ownerId !== userId && !adminIds.includes(userId) && !memberIds.includes(userId)) {
    room.members.push(req.user._id);
    await room.save();
  }

  res.json({
    message: "You joined the room successfully.",
    roomId: room._id,
  });
});

export const uploadPhoto = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError("Please select a photo to upload.");
  }

  const room = await ensureRoomAccess(req.params.roomId, req.user);

  room.uploads.push({
    filename: req.file.filename,
    originalName: req.file.originalname,
    url: `/uploads/${req.file.filename}`,
    uploadedBy: req.user._id,
  });

  await room.save();
  await room.populate("uploads.uploadedBy", "name role");

  res.status(201).json({
    message: "Photo uploaded successfully.",
    uploads: room.uploads,
  });
});

export const downloadPhoto = asyncHandler(async (req, res) => {
  const room = await Room.findOne({ "uploads._id": req.params.photoId })
    .populate("owner", "name email role")
    .populate("admins", "name email role")
    .populate("members", "name email role");

  if (!room) {
    throw new AppError("Photo not found.", 404);
  }

  const accessibleRoom = await ensureRoomAccess(room._id, req.user);
  const upload = getPhotoById(accessibleRoom, req.params.photoId);

  if (!upload) {
    throw new AppError("Photo not found.", 404);
  }

  const filePath = getUploadFilePath(upload);

  if (!fs.existsSync(filePath)) {
    throw new AppError("The photo file could not be found.", 404);
  }

  res.download(filePath, buildDownloadFilename(upload), (error) => {
    if (error && !res.headersSent) {
      res.status(500).json({ message: "Could not download this photo." });
    }
  });
});

export const downloadRoomPhotos = asyncHandler(async (req, res) => {
  const room = await ensureRoomAccess(req.params.roomId, req.user);
  const requestedIds = String(req.query.photoIds || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  const selectedUploads = requestedIds.length
    ? requestedIds.map((photoId) => {
        const upload = getPhotoById(room, photoId);

        if (!upload) {
          throw new AppError("One or more selected photos could not be found.", 404);
        }

        return upload;
      })
    : room.uploads;

  if (!selectedUploads.length) {
    throw new AppError("There are no photos available to download.", 400);
  }

  const zipName = `${sanitizeFilenamePart(room.title, "pixroom-room")}-photos.zip`;

  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", `attachment; filename="${zipName}"`);

  const archive = archiver("zip", { zlib: { level: 9 } });

  archive.on("error", () => {
    if (!res.headersSent) {
      res.status(500).json({ message: "Could not prepare ZIP file." });
    } else {
      res.destroy();
    }
  });

  archive.pipe(res);

  const usedNames = new Map();
  let filesAdded = 0;

  for (const upload of selectedUploads) {
    const filePath = getUploadFilePath(upload);

    if (!fs.existsSync(filePath)) {
      continue;
    }

    const filename = createUniqueFilename(buildDownloadFilename(upload), usedNames);
    archive.file(filePath, { name: filename });
    filesAdded += 1;
  }

  if (!filesAdded) {
    throw new AppError("Could not prepare ZIP file.", 500);
  }

  await archive.finalize();
});

export const addComment = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message?.trim()) {
    throw new AppError("Message cannot be empty.");
  }

  const room = await ensureRoomAccess(req.params.roomId, req.user);

  room.comments.push({
    message: message.trim(),
    author: req.user._id,
  });

  await room.save();
  await room.populate("comments.author", "name");

  res.status(201).json({
    message: "Message sent successfully.",
    comments: room.comments,
  });
});

export const getDashboard = asyncHandler(async (req, res) => {
  const rooms = await Room.find({
    $or: [{ owner: req.user._id }, { members: req.user._id }],
  })
    .populate("owner", "name")
    .sort({ updatedAt: -1 })
    .limit(6);

  const { start, end } = getMonthWindow();
  const createdThisMonth = await Room.countDocuments({
    owner: req.user._id,
    createdAt: { $gte: start, $lt: end },
  });

  const photographerCount = await User.countDocuments({ role: "photographer" });
  const pendingFriendRequests = await Friendship.countDocuments({
    receiver: req.user._id,
    status: "pending",
  });
  const pendingRoomInvitations = await RoomInvitation.countDocuments({
    invitee: req.user._id,
    status: "pending",
  });

  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      subscriptionPlan: req.user.subscriptionPlan,
      features: getPlanFeatures(req.user),
    },
    stats: {
      roomsCount: rooms.length,
      roomsCreatedThisMonth: createdThisMonth,
      uploadsCount: rooms.reduce((sum, room) => sum + room.uploads.length, 0),
      availablePhotographers: photographerCount,
      pendingInvites: pendingFriendRequests + pendingRoomInvitations,
    },
    rooms: rooms.map((room) => serializeRoom(room, req.user._id.toString())),
  });
});

export const inviteFriendToRoom = asyncHandler(async (req, res) => {
  const { inviteeId } = req.body;

  if (!inviteeId) {
    throw new AppError("Select a friend to invite.");
  }

  const room = await ensureRoomManagementAccess(req.params.roomId, req.user);

  if (!(await User.exists({ _id: inviteeId }))) {
    throw new AppError("Friend not found.", 404);
  }

  const friendship = await Friendship.findOne({
    status: "accepted",
    $or: [
      { requester: req.user._id, receiver: inviteeId },
      { requester: inviteeId, receiver: req.user._id },
    ],
  });

  if (!friendship) {
    throw new AppError("Only accepted friends can be invited to a room.", 403);
  }

  const inviteeIdString = inviteeId.toString();
  const ownerId = room.owner._id.toString();
  const adminIds = room.admins.map((admin) => admin._id.toString());
  const memberIds = room.members.map((member) => member._id.toString());

  if ([ownerId, ...adminIds, ...memberIds].includes(inviteeIdString)) {
    throw new AppError("This friend already has access to the room.", 409);
  }

  let invitation = await RoomInvitation.findOne({ room: room._id, invitee: inviteeId });

  if (invitation?.status === "pending") {
    throw new AppError("A room invitation is already pending for this friend.", 409);
  }

  if (invitation?.status === "accepted") {
    throw new AppError("This friend has already accepted the invitation.", 409);
  }

  if (!invitation) {
    invitation = new RoomInvitation({
      room: room._id,
      inviter: req.user._id,
      invitee: inviteeId,
      status: "pending",
    });
  } else {
    invitation.inviter = req.user._id;
    invitation.status = "pending";
  }

  await invitation.save();
  await invitation.populate([
    { path: "room", select: "title visibility code" },
    { path: "inviter", select: "name email" },
    { path: "invitee", select: "name email" },
  ]);

  res.status(201).json({
    message: "Room invitation sent.",
    invitation: serializeRoomInvitation(invitation, req.user._id.toString()),
  });
});

export const getMyRoomInvitations = asyncHandler(async (req, res) => {
  const invitations = await RoomInvitation.find({
    $or: [{ invitee: req.user._id }, { inviter: req.user._id }],
  })
    .populate("room", "title visibility code")
    .populate("inviter", "name email")
    .populate("invitee", "name email")
    .sort({ updatedAt: -1 });

  const serialized = invitations.map((invitation) =>
    serializeRoomInvitation(invitation, req.user._id.toString()),
  );

  res.json({
    pendingReceived: serialized.filter(
      (invitation) => invitation.direction === "received" && invitation.status === "pending",
    ),
    pendingSent: serialized.filter(
      (invitation) => invitation.direction === "sent" && invitation.status === "pending",
    ),
    history: serialized.filter((invitation) => invitation.status !== "pending"),
  });
});

export const getRoomInvitations = asyncHandler(async (req, res) => {
  const room = await ensureRoomManagementAccess(req.params.roomId, req.user);
  const invitations = await RoomInvitation.find({ room: room._id })
    .populate("room", "title visibility code")
    .populate("inviter", "name email")
    .populate("invitee", "name email")
    .sort({ updatedAt: -1 });

  res.json({
    invitations: invitations.map((invitation) =>
      serializeRoomInvitation(invitation, req.user._id.toString()),
    ),
  });
});

export const acceptRoomInvitation = asyncHandler(async (req, res) => {
  const invitation = await RoomInvitation.findById(req.params.invitationId).populate([
    { path: "room", select: "title visibility code owner admins members" },
    { path: "inviter", select: "name email" },
    { path: "invitee", select: "name email" },
  ]);

  if (!invitation) {
    throw new AppError("Room invitation not found.", 404);
  }

  if (invitation.invitee._id.toString() !== req.user._id.toString()) {
    throw new AppError("Only the invited user can accept this invitation.", 403);
  }

  if (invitation.status !== "pending") {
    throw new AppError("Only pending room invitations can be accepted.", 400);
  }

  invitation.status = "accepted";
  await invitation.save();

  const room = await Room.findById(invitation.room._id);
  const alreadyMember =
    room.owner.toString() === req.user._id.toString() ||
    room.admins.some((admin) => admin.toString() === req.user._id.toString()) ||
    room.members.some((member) => member.toString() === req.user._id.toString());

  if (!alreadyMember) {
    room.members.push(req.user._id);
    await room.save();
  }

  res.json({
    message: "Room invitation accepted.",
    invitation: serializeRoomInvitation(invitation, req.user._id.toString()),
    roomId: room._id,
  });
});

export const rejectRoomInvitation = asyncHandler(async (req, res) => {
  const invitation = await RoomInvitation.findById(req.params.invitationId).populate([
    { path: "room", select: "title visibility code" },
    { path: "inviter", select: "name email" },
    { path: "invitee", select: "name email" },
  ]);

  if (!invitation) {
    throw new AppError("Room invitation not found.", 404);
  }

  if (invitation.invitee._id.toString() !== req.user._id.toString()) {
    throw new AppError("Only the invited user can reject this invitation.", 403);
  }

  if (invitation.status !== "pending") {
    throw new AppError("Only pending room invitations can be rejected.", 400);
  }

  invitation.status = "rejected";
  await invitation.save();

  res.json({
    message: "Room invitation rejected.",
    invitation: serializeRoomInvitation(invitation, req.user._id.toString()),
  });
});
