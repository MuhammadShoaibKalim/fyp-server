
import express from "express";
import {isAuthenticated, isRole} from "../middlewares/auth.middleware.js";

import { 
    loginLabAdmin,
    logoutLabAdmin,
    getLabAdminOverview
} from "../controllers/labAdmin.controller.js";
const router = express.Router();

router.post("/login", loginLabAdmin);
router.post("/logout", logoutLabAdmin);
router.get("/overview", isAuthenticated, isRole(["Super Admin"]), getLabAdminOverview);

export default router;