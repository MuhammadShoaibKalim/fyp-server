import express from "express";
import  {userRegister, userLogin, userLogout}  from "../controllers/user.controller.js";

const router = express.Router(); 

router.post("/register", userRegister); 
router.post("/login", userLogin); 
router.get("/logout", userLogout); 
router.post("/logout", userLogout); 



export default router; 
