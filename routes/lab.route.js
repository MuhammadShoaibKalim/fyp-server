import express from "express";
import {
    addLab, getLabs, updateLab, deleteLab, addTestToLab,
    getCollectionsByLab
} from "../controllers/lab.controller.js";
import { protect, isSuperAdmin, isLabAdmin, isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

//  Create a Lab (Super Admin or Lab Admin)
router.post("/create", protect,  addLab);

// Get Labs (Super Admin sees all, Lab Admin sees their own)
router.get("/", protect, getLabs);

// Update Lab (Super Admin can update all, Lab Admin can update their own)
router.put("/:id", protect, updateLab);

// Delete Lab (Only Super Admin)
router.delete("/:id", protect, isSuperAdmin, deleteLab);

// fetch all tests/packages for a lab
router.get("/:labId", isAuthenticated, getCollectionsByLab);


export default router;
