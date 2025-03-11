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
import queryRoutes from "./routes/query.route.js"
import aiRoutes from "./routes/ai.route.js"
import testPackageRoutes from "./routes/testpackage.route.js"
//load e variables
dotenv.config();
const app = express();


// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//Routes
app.use("/api/auth", authRouter);  
app.use("/api/superadmin", superAdminRoutes);
app.use("/api/labadmin", labAdminRoutes);
app.use("/api/labs",  labRoutes);
app.use("/api/tests", testPackageRoutes );
app.use("/api/packages", testPackageRoutes );
app.use("/api/orders", orderRoutes); 
app.use("/api/users", userRoutes)
app.use("/api/settings", superAdminRoutes)
app.use("/api/query", queryRoutes);
app.use("/api/ai", aiRoutes)


//server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
})


// Connect to MongoDB
connectDB();      

