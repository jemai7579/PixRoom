import mongoose from "mongoose";
import { Friendship } from "../models/Friendship.js";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/appError.js";

function serializeUser(user) {
  const location = user.photographerProfile?.location || user.photographerProfile?.city || "";

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    profilePhoto: user.photographerProfile?.profilePhoto || "",
    location,
    specialties: user.photographerProfile?.specialties || [],
  };
}

function serializeFriendship(friendship, currentUserId) {
  const isRequester = friendship.requester._id.toString() === currentUserId;
  const otherUser = isRequester ? friendship.receiver : friendship.requester;

  return {
    id: friendship._id,
    status: friendship.status,
    createdAt: friendship.createdAt,
    updatedAt: friendship.updatedAt,
    requester: serializeUser(friendship.requester),
    receiver: serializeUser(friendship.receiver),
    user: serializeUser(otherUser),
    direction: isRequester ? "sent" : "received",
  };
}

async function findExistingFriendship(userId, otherUserId) {
  return Friendship.findOne({
    $or: [
      { requester: userId, receiver: otherUserId },
      { requester: otherUserId, receiver: userId },
    ],
  });
}

export const searchUsers = asyncHandler(async (req, res) => {
  const query = req.query.q?.trim() || "";
  const currentUserId = req.user._id.toString();

  if (!query) {
    return res.json({ users: [] });
  }

  const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
  const users = await User.find({
    _id: { $ne: req.user._id },
    $or: [{ name: regex }, { email: regex }],
  })
    .select("name email role photographerProfile")
    .limit(12);

  const userIds = users.map((user) => user._id);
  const friendships = await Friendship.find({
    $or: [
      { requester: req.user._id, receiver: { $in: userIds } },
      { receiver: req.user._id, requester: { $in: userIds } },
    ],
  }).select("requester receiver status");

  const relationshipMap = new Map();

  friendships.forEach((friendship) => {
    const otherUserId =
      friendship.requester.toString() === currentUserId
        ? friendship.receiver.toString()
        : friendship.requester.toString();

    relationshipMap.set(otherUserId, {
      status: friendship.status,
      direction: friendship.requester.toString() === currentUserId ? "sent" : "received",
    });
  });

  res.json({
    users: users.map((user) => ({
      ...serializeUser(user),
      friendship: relationshipMap.get(user._id.toString()) || null,
    })),
  });
});

export const sendFriendRequest = asyncHandler(async (req, res) => {
  const { receiverId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(receiverId)) {
    throw new AppError("Choose a valid user to connect with.");
  }

  if (receiverId === req.user._id.toString()) {
    throw new AppError("You cannot send a friend request to yourself.");
  }

  const receiver = await User.findById(receiverId).select("name email role photographerProfile");

  if (!receiver) {
    throw new AppError("User not found.", 404);
  }

  const existingFriendship = await findExistingFriendship(req.user._id, receiverId);

  if (!existingFriendship) {
    const friendship = await Friendship.create({
      requester: req.user._id,
      receiver: receiverId,
      status: "pending",
    });

    await friendship.populate([
      { path: "requester", select: "name email role photographerProfile" },
      { path: "receiver", select: "name email role photographerProfile" },
    ]);

    return res.status(201).json({
      message: "Friend request sent.",
      friendship: serializeFriendship(friendship, req.user._id.toString()),
    });
  }

  if (existingFriendship.status === "accepted") {
    throw new AppError("You are already friends with this user.", 409);
  }

  if (existingFriendship.status === "pending") {
    if (existingFriendship.requester.toString() === req.user._id.toString()) {
      throw new AppError("Friend request already sent.", 409);
    }

    throw new AppError("This user has already sent you a friend request.", 409);
  }

  existingFriendship.requester = req.user._id;
  existingFriendship.receiver = receiverId;
  existingFriendship.status = "pending";
  await existingFriendship.save();
  await existingFriendship.populate([
    { path: "requester", select: "name email role photographerProfile" },
    { path: "receiver", select: "name email role photographerProfile" },
  ]);

  res.json({
    message: "Friend request sent.",
    friendship: serializeFriendship(existingFriendship, req.user._id.toString()),
  });
});

export const acceptFriendRequest = asyncHandler(async (req, res) => {
  const friendship = await Friendship.findById(req.params.requestId).populate([
    { path: "requester", select: "name email role photographerProfile" },
    { path: "receiver", select: "name email role photographerProfile" },
  ]);

  if (!friendship) {
    throw new AppError("Friend request not found.", 404);
  }

  if (friendship.receiver._id.toString() !== req.user._id.toString()) {
    throw new AppError("Only the recipient can accept this request.", 403);
  }

  if (friendship.status !== "pending") {
    throw new AppError("Only pending friend requests can be accepted.", 400);
  }

  friendship.status = "accepted";
  await friendship.save();

  res.json({
    message: "Friend request accepted.",
    friendship: serializeFriendship(friendship, req.user._id.toString()),
  });
});

export const rejectFriendRequest = asyncHandler(async (req, res) => {
  const friendship = await Friendship.findById(req.params.requestId).populate([
    { path: "requester", select: "name email role photographerProfile" },
    { path: "receiver", select: "name email role photographerProfile" },
  ]);

  if (!friendship) {
    throw new AppError("Friend request not found.", 404);
  }

  if (friendship.receiver._id.toString() !== req.user._id.toString()) {
    throw new AppError("Only the recipient can reject this request.", 403);
  }

  if (friendship.status !== "pending") {
    throw new AppError("Only pending friend requests can be rejected.", 400);
  }

  friendship.status = "rejected";
  await friendship.save();

  res.json({
    message: "Friend request rejected.",
    friendship: serializeFriendship(friendship, req.user._id.toString()),
  });
});

export const cancelFriendRequest = asyncHandler(async (req, res) => {
  const friendship = await Friendship.findById(req.params.requestId).populate([
    { path: "requester", select: "name email role photographerProfile" },
    { path: "receiver", select: "name email role photographerProfile" },
  ]);

  if (!friendship) {
    throw new AppError("Friend request not found.", 404);
  }

  if (friendship.requester._id.toString() !== req.user._id.toString()) {
    throw new AppError("Only the requester can cancel this request.", 403);
  }

  if (friendship.status !== "pending") {
    throw new AppError("Only pending requests can be cancelled.", 400);
  }

  friendship.status = "cancelled";
  await friendship.save();

  res.json({
    message: "Friend request cancelled.",
    friendship: serializeFriendship(friendship, req.user._id.toString()),
  });
});

export const getFriendshipsOverview = asyncHandler(async (req, res) => {
  const friendships = await Friendship.find({
    $or: [{ requester: req.user._id }, { receiver: req.user._id }],
  })
    .populate("requester", "name email role photographerProfile")
    .populate("receiver", "name email role photographerProfile")
    .sort({ updatedAt: -1 });

  const serialized = friendships.map((friendship) =>
    serializeFriendship(friendship, req.user._id.toString()),
  );

  res.json({
    friends: serialized.filter((friendship) => friendship.status === "accepted"),
    pendingReceived: serialized.filter(
      (friendship) => friendship.status === "pending" && friendship.direction === "received",
    ),
    pendingSent: serialized.filter(
      (friendship) => friendship.status === "pending" && friendship.direction === "sent",
    ),
    history: serialized.filter((friendship) => friendship.status !== "pending"),
  });
});
