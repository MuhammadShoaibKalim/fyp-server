import express from "express";
import {
  createSuperAdmin, loginSuperAdmin, logoutSuperAdmin, createLabAdmin,
  getLabs, addLab, updateLab, deleteLab, getUsers, updateUser, deleteUser,
  getCollections, addCollection, updateCollection, deleteCollection,
  getInbox, respondToInbox, getSettings, updateSettings,
  // getPages, addPage, updatePage, deletePage
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

// Super Admin Creates Lab Admin
router.post("/create-labadmin", isAuthenticated, isRole(["Super Admin"]), createLabAdmin);

// Manage Labs
router.get("/labs", isAuthenticated, isRole(["Super Admin"]), getLabs);
router.post("/labs", isAuthenticated, isRole(["Super Admin"]), addLab);
router.put("/labs/:id", isAuthenticated, isRole(["Super Admin"]), updateLab);
router.delete("/labs/:id", isAuthenticated, isRole(["Super Admin"]), deleteLab);

// Manage Users
router.get("/users", isAuthenticated, isRole(["Super Admin"]), getUsers);
router.put("/users/:id", isAuthenticated, isRole(["Super Admin"]), updateUser);
router.delete("/users/:id", isAuthenticated, isRole(["Super Admin"]), deleteUser);

// Manage Collections (Tests & Packages for Any Lab)
router.get("/collections", isAuthenticated, isRole(["Super Admin"]), getCollections);
router.post("/collections", isAuthenticated, isRole(["Super Admin"]), addCollection);
router.put("/collections/:id", isAuthenticated, isRole(["Super Admin"]), updateCollection);
router.delete("/collections/:id", isAuthenticated, isRole(["Super Admin"]), deleteCollection);

// Manage Inbox (General Queries from Users)
router.get("/inbox", isAuthenticated, isRole(["Super Admin"]), getInbox);
router.post("/inbox/respond/:id", isAuthenticated, isRole(["Super Admin"]), respondToInbox);

// Manage Pages (About, Contact, FAQ, etc.)
// router.get("/pages", isAuthenticated, isRole(["Super Admin"]), getPages);
// router.post("/pages", isAuthenticated, isRole(["Super Admin"]), addPage);
// router.put("/pages/:id", isAuthenticated, isRole(["Super Admin"]), updatePage);
// router.delete("/pages/:id", isAuthenticated, isRole(["Super Admin"]), deletePage);

// Super Admin Personal Settings
router.get("/settings", isAuthenticated, isRole(["Super Admin"]), getSettings);
router.put("/settings", isAuthenticated, isRole(["Super Admin"]), updateSettings);

export default router;
