import express from "express";
import {
    createLab,
    getLabsByLabAdmin,
    updateLab,
    deleteLab
} from "../controllers/lab.controller.js";
import { isAuthenticated, isRole } from "../middlewares/auth.middleware.js";
import Lab from "../models/lab.model.js";

const router = express.Router();
router.post("/", isAuthenticated, isRole(["Lab Admin"]), createLab );
router.get("/", isAuthenticated, isRole(["Lab Admin"]), getLabsByLabAdmin );
router.put("/:id", isAuthenticated, isRole(["Lab Admin"]), updateLab);
router.delete("/:id", isAuthenticated, isRole(["Lab Admin"]), deleteLab);

export default router;
