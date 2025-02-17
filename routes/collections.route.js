import express from "express";
import {
  addCollection,
  updateCollection,
  deleteCollection,
  getCollections,
  getCollectionById,
} from "../controllers/collections.controller.js";
import { isAuthenticated,isRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(isAuthenticated, isRole(["Super Admin"])); 
router.post("/", addCollection); 
router.get("/", getCollections); 
router.get("/:id", getCollectionById); 
router.put("/:id", updateCollection); 
router.delete("/:id", deleteCollection); 

export default router;
