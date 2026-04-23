import { Router } from "express";
import multer from "multer";
import path from "node:path";
import {
  acceptRoomInvitation,
  addComment,
  createRoom,
  downloadPhoto,
  downloadRoomPhotos,
  getDashboard,
  getMyRoomInvitations,
  getRoomInvitations,
  getRoom,
  inviteFriendToRoom,
  invitePhotographerToRoom,
  joinRoomByCode,
  listRooms,
  rejectRoomInvitation,
  uploadPhoto,
} from "../controllers/roomController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext).replace(/\s+/g, "-").toLowerCase();
    cb(null, `${Date.now()}-${basename}${ext}`);
  },
});

const upload = multer({ storage });
const router = Router();

router.use(requireAuth);
router.get("/dashboard", getDashboard);
router.get("/", listRooms);
router.post("/", createRoom);
router.post("/join", joinRoomByCode);
router.get("/invitations/mine", getMyRoomInvitations);
router.post("/invitations/:invitationId/accept", acceptRoomInvitation);
router.post("/invitations/:invitationId/reject", rejectRoomInvitation);
router.get("/photos/:photoId/download", downloadPhoto);
router.post("/:roomId/invitations", inviteFriendToRoom);
router.post("/:roomId/invite-photographer", invitePhotographerToRoom);
router.get("/:roomId/invitations", getRoomInvitations);
router.get("/:roomId/download", downloadRoomPhotos);
router.get("/:roomId", getRoom);
router.post("/:roomId/uploads", upload.single("photo"), uploadPhoto);
router.post("/:roomId/comments", addComment);

export { router as roomRoutes };
