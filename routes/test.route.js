import express from "express";
import { isAuthenticated, isRole } from "../middlewares/auth.middleware.js";
import {
  addTest,
  updateTest,
  deleteTest,
  getAllTests,
  getTestDetails,
} from "../controllers/test.controller.js";

const router = express.Router();

router.post("/", isAuthenticated, isRole(["Lab Admin"]), addTest);
router.put("/:id", isAuthenticated, isRole(["Lab Admin"]), updateTest);
router.delete("/:id", isAuthenticated, isRole(["Lab Admin"]), deleteTest);
router.get("/", isAuthenticated, isRole(["Lab Admin"]), getAllTests);  
router.get("/:id", isAuthenticated, isRole(["Lab Admin"]), getTestDetails);

export default router;
