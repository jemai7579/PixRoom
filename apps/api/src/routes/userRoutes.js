import { Router } from "express";
import { updateProfile } from "../controllers/userController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.patch("/profile", requireAuth, updateProfile);

export { router as userRoutes };
