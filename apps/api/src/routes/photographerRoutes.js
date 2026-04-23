import { Router } from "express";
import { getPhotographerInvitations } from "../controllers/roomController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.use(requireAuth);
router.get("/invitations", getPhotographerInvitations);

export { router as photographerRoutes };
