import express from "express";
import { createSuperAdmin, 
         loginSuperAdmin,
         logoutSuperAdmin,
         createLabAdmin,
         superAdminOverview, 
         getLabs, 
         addLab, 
         updateLab, 
         deleteLab, 
         getUsers, 
         updateUser, 
         deleteUser,
         getCollections,
         addCollection, 
         updateCollection, 
         deleteCollection,
         getInbox,
         deleteInboxItem,
         getSettings,
         updateSettings
        } from "../controllers/superAdmin.controller.js";
import { isAuthenticated, isRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create-superadmin", (req, res, next) => {
    const secretKey = process.env.SUPERADMIN_SECRET_KEY;
    const providedKey = req.headers["x-secret-key"];
  
    if (providedKey !== secretKey) {
      return res.status(403).json({ message: "Access denied. Invalid secret key." });
    }
    next();
  }, createSuperAdmin);
router.post("/login", loginSuperAdmin);
router.post("/logout", logoutSuperAdmin);  
router.post("/create-labadmin", isAuthenticated,  isRole(["Super Admin"]), createLabAdmin);

router.get("/protected-route", isAuthenticated, isRole(["Super Admin"]), (req, res) => {
    res.status(200).json({ message: "Access granted to Super Admin" });
  });
 
  

// super admin overview route
router.get("/overview", superAdminOverview);


// routes/labs/superAdmin.route.js
router.get("/labs", getLabs);
router.post("/labs", addLab);
router.put("/labs/:id", updateLab);
router.delete("/labs/:id", deleteLab);


// routes/users/superAdmin.route.js
router.get("/users", getUsers);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);


// routes/collections/superAdmin.route.js
router.get("/collections", getCollections);
router.post("/collections", addCollection);
router.put("/collections/:id", updateCollection);
router.delete("/collections/:id", deleteCollection);


// routes/inbox/superAdmin.route.js
router.get("/inbox", getInbox);
router.delete("/inbox/:id", deleteInboxItem);


// routes/settings/superAdmin.route.js
router.get("/settings", getSettings);
router.put("/settings", updateSettings);



export default router;