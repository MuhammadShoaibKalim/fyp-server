import express from 'express';
import connectDB from './db/db.js';
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import authRouter from "./routes/user.route.js";
import orderRoutes from "./routes/order.route.js";
import superAdminRoutes from "./routes/superAdmin.route.js";
// import labAdminRoutes from "./routes/labAdmin.route.js";
// import labRoutes from "./routes/lab.route.js";
// import testRoutes from "./routes/test.route.js";
// import packageRoutes from "./routes/package.route.js";
// import collectionRoutes from "./routes/collections.route.js";

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

// app.use("/api/tests", testRoutes);  
// app.use("/api/labadmin", labAdminRoutes);
// app.use("/api/v1/labs", labRoutes);
// app.use("/api/v1/tests", testRoutes);
// app.use("/api/v1/packages", packageRoutes);
// app.use("/api/v1/collections", collectionRoutes);


app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
})


connectDB();