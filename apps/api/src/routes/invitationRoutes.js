import { Router } from "express";
import {
  acceptRoomInvitation,
  rejectRoomInvitation,
} from "../controllers/roomController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.use(requireAuth);
router.post("/:invitationId/accept", acceptRoomInvitation);
router.post("/:invitationId/reject", rejectRoomInvitation);

export { router as invitationRoutes };
