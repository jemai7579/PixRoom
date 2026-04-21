import { Router } from "express";
import {
  acceptFriendRequest,
  cancelFriendRequest,
  getFriendshipsOverview,
  rejectFriendRequest,
  searchUsers,
  sendFriendRequest,
} from "../controllers/socialController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.use(requireAuth);
router.get("/users/search", searchUsers);
router.get("/friendships", getFriendshipsOverview);
router.post("/friend-requests", sendFriendRequest);
router.post("/friend-requests/:requestId/accept", acceptFriendRequest);
router.post("/friend-requests/:requestId/reject", rejectFriendRequest);
router.post("/friend-requests/:requestId/cancel", cancelFriendRequest);

export { router as socialRoutes };
