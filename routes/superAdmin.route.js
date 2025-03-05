import express from "express";
import {
  createSuperAdmin, loginSuperAdmin, logoutSuperAdmin,
  getInbox, respondToInbox, getSettings, updateSettings,
  superAdminOverview,changePassword
} from "../controllers/superAdmin.controller.js";
import { isAuthenticated, isRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Create, login and logout Super Admin 
router.post("/create-superadmin", (req, res, next) => {
  const secretKey = process.env.SUPERADMIN_SECRET_KEY;
  const providedKey = req.headers["x-secret-key"];

  if (providedKey !== secretKey) {
    return res.status(403).json({ message: "Access denied. Invalid secret key." });
  }
  next();
}, createSuperAdmin);
router.post("/login", loginSuperAdmin);
router.post("/logout", logoutSuperAdmin);


// Inbox Routes
router.get("/", isAuthenticated, isRole(["Super Admin"]), getInbox);
router.post("/inbox/:id", isAuthenticated, isRole(["Super Admin"]), respondToInbox);

// Super Admin Settings Routes
router.get("/get-settings", isAuthenticated, isRole(["Super Admin"]), getSettings);
router.put("/update-settings", isAuthenticated, isRole(["Super Admin"]), updateSettings);
router.put("/password", isAuthenticated, isRole(["Super Admin"]), changePassword);

export default router;
