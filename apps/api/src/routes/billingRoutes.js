import { Router } from "express";
import { getBillingSummary, selectPlan } from "../controllers/billingController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.use(requireAuth);
router.get("/summary", getBillingSummary);
router.post("/select-plan", selectPlan);

export { router as billingRoutes };
