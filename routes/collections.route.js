import express from "express";
import {
  getCollections,
  getSpecificCollectionById,
  addCollection,
  updateCollection,
  deleteCollection,
} from "../controllers/collections.controller.js";
import { isAuthenticated, isLabAdmin, isSuperAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/add-collection", isAuthenticated, addCollection);
router.get("/", isAuthenticated, getCollections);
router.get("/:id", isAuthenticated, getSpecificCollectionById);
router.put("/:id", isAuthenticated, updateCollection);
router.delete("/:id", isAuthenticated, deleteCollection);

export default router;
