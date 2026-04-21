import { Router } from "express";
import { askAssistant } from "../controllers/assistantController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.use(requireAuth);
router.post("/chat", askAssistant);

export { router as assistantRoutes };
