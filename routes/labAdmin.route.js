
import express from "express";
import {isAuthenticated} from "../middlewares/auth.middleware.js";

import { 
    loginLabAdmin,
    logoutLabAdmin,
    getLabAdminOverview
} from "../controllers/labAdmin.controller.js";
const router = express.Router();

router.post("/login", loginLabAdmin);
router.post("/logout", logoutLabAdmin);
router.get("/overview", isAuthenticated, getLabAdminOverview);

export default router;