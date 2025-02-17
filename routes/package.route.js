import express from "express";
import { isAuthenticated, isRole } from "../middlewares/auth.middleware.js";
import {
  addPackage,
  updatePackage,
  deletePackage,
  getAllPackages,
  getPackageDetails,
} from "../controllers/package.controller.js";

const router = express.Router();

router.post("/", isAuthenticated, isRole(["Lab Admin"]), addPackage);
router.put("/:id", isAuthenticated, isRole(["Lab Admin"]), updatePackage);
router.delete("/:id", isAuthenticated, isRole(["Lab Admin"]), deletePackage);
router.get("/", isAuthenticated, isRole(["Lab Admin"]), getAllPackages);
router.get("/:id", isAuthenticated, isRole(["Lab Admin"]), getPackageDetails);

export default router;
