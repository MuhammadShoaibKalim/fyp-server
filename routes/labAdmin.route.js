import express from "express";
import {
  getLabAdminOverview,
  updateLabAdminProfile,
  getInboxMessages,
  respondToInboxMessage,
  getLabAdminProfile,
  loginLabAdmin,
  logoutLabAdmin,
  updateLabDetails
} from "../controllers/labAdmin.controller.js";
import { isAuthenticated, isLabAdmin,  } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/login", loginLabAdmin);
router.post("/logout", logoutLabAdmin);
router.get("/overview",isLabAdmin, isAuthenticated , getLabAdminOverview);
router.get("/:id", isLabAdmin, getLabAdminProfile);
router.put("/:id", isLabAdmin, updateLabAdminProfile);
router.put("/:id", isLabAdmin, updateLabDetails);
router.get("/inbox", isLabAdmin, getInboxMessages);
router.post("/inbox/:id/respond", isLabAdmin, respondToInboxMessage);

export default router;
