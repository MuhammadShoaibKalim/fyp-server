import express from "express";
import {
  addLab,
  getLab,
  updateLab,
  deleteLab,
} from "../controllers/lab.controller.js";
import {  isAuthenticated, isLabAdmin, isSuperAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create", isAuthenticated, isSuperAdmin , addLab);
router.put("/:id", isAuthenticated, isLabAdmin, updateLab);
router.get("/", isAuthenticated, isSuperAdmin, isLabAdmin, getLab);
router.delete("/:id", isLabAdmin, isAuthenticated, deleteLab);

export default router;
