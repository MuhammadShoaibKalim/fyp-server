import express from "express";
import { isAuthenticated, isRole } from "../middlewares/auth.middleware.js";
import {
  getUsers, 
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { createLabAdmin } from "../controllers/superAdmin.controller.js";

const router = express.Router();

// Super Admin Creates Lab Admin(Users)
router.post("/create-labadmin", isAuthenticated, isRole(["Super Admin"]), createLabAdmin);
router.get("/", isAuthenticated, isRole(["Super Admin"]), getUsers);
router.put("/:id", isAuthenticated, updateUser);
router.delete("/:id", isAuthenticated, isRole(["Super Admin"]), deleteUser);

export default router;
