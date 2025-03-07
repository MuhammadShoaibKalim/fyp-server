import express from "express";
import { createTest, updateTest, deleteTest, getAllTests,createPackage, updatePackage, deletePackage, getAllPackages  } from "../controllers/testpackage.controller.js";
import {  isLabAdmin, isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", isAuthenticated, isLabAdmin, createTest);
router.put("/:id", isAuthenticated, isLabAdmin, updateTest);
router.delete("/:id", isAuthenticated, isLabAdmin, deleteTest);
router.get("/", isAuthenticated, getAllTests);


router.post("/", isAuthenticated, isLabAdmin, createPackage);
router.put("/:id", isAuthenticated, isLabAdmin, updatePackage);
router.delete("/:id", isAuthenticated, isLabAdmin, deletePackage);
router.get("/", isAuthenticated, getAllPackages);
export default router;
