import express from 'express';
import connectDB from './config/db.js';
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import orderRoutes from "./routes/order.route.js";
import superAdminRoutes from "./routes/superAdmin.route.js";
import labAdminRoutes from "./routes/labAdmin.route.js";
import {protect} from './middlewares/auth.middleware.js';
import labRoutes from "./routes/lab.route.js";
import userRoutes from "./routes/user.route.js";
import collectionRoutes from "./routes/collections.route.js";


dotenv.config();

const PORT = process.env.PORT || 5001;
const app = express();


// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRouter);  
app.use("/api/orders", orderRoutes); 
app.use("/api/superadmin", superAdminRoutes);
app.use("/api/labadmin", labAdminRoutes);
app.use("/api/labs", protect, labRoutes);
app.use("/api/users", userRoutes)
app.use("/api/collections", collectionRoutes);
app.use("/api/settings", superAdminRoutes)
app.use("/api/inbox", superAdminRoutes);



app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
})


connectDB();