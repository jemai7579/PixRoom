import { Router } from "express";
import { assistantRoutes } from "./assistantRoutes.js";
import { authRoutes } from "./authRoutes.js";
import { billingRoutes } from "./billingRoutes.js";
import { invitationRoutes } from "./invitationRoutes.js";
import { marketplaceRoutes } from "./marketplaceRoutes.js";
import { photographerRoutes } from "./photographerRoutes.js";
import { roomRoutes } from "./roomRoutes.js";
import { socialRoutes } from "./socialRoutes.js";
import { userRoutes } from "./userRoutes.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "PixRoom+ API",
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/social", socialRoutes);
router.use("/rooms", roomRoutes);
router.use("/photographer", photographerRoutes);
router.use("/invitations", invitationRoutes);
router.use("/billing", billingRoutes);
router.use("/marketplace", marketplaceRoutes);
router.use("/assistant", assistantRoutes);

export { router };
