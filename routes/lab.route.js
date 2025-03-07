import express from "express";
import {
  addLab,
  getLab,
  updateLab,
  deleteLab,
} from "../controllers/lab.controller.js";
import { isLabAdmin, isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create", isLabAdmin, isAuthenticated, addLab);
router.put("/:id", isLabAdmin, isAuthenticated, updateLab);
router.get("/", isLabAdmin, isAuthenticated, getLab);
router.post("/create", isLabAdmin, isAuthenticated, addLab);
router.delete("/:id", isLabAdmin, isAuthenticated, deleteLab);

export default router;
