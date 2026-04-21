import { Router } from "express";
import {
  createBookingRequest,
  listMyBookingRequests,
  listPhotographers,
  listSavedPhotographers,
  listSkippedPhotographers,
  savePhotographerInterest,
  resetSkippedPhotographers,
  undoPhotographerInterest,
  updateBookingRequestStatus,
} from "../controllers/marketplaceController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.use(requireAuth);
router.get("/photographers", listPhotographers);
router.get("/saved", listSavedPhotographers);
router.get("/skipped", listSkippedPhotographers);
router.get("/booking-requests", listMyBookingRequests);
router.patch("/booking-requests/:requestId/status", updateBookingRequestStatus);
router.post("/photographers/actions/undo", undoPhotographerInterest);
router.post("/photographers/skipped/reset", resetSkippedPhotographers);
router.post("/photographers/:photographerId/interest", savePhotographerInterest);
router.post("/photographers/:photographerId/booking-requests", createBookingRequest);

export { router as marketplaceRoutes };
