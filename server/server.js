// import './config/instrument.js'
// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import 'dotenv/config'
// import connectDB from "./config/db.js";
// import * as Sentry from "@sentry/node";
// import { clerkWebhooks } from './controller/webhooks.js';
// import companyRoutes from './routes/companyRoutes.js'
// import connectCloudinary from './config/cloudinary.js';
// import JobRoutes from './routes/jobRoutes.js';
// import userRoutes from './routes/userRoutes.js';
// import { clerkMiddleware } from '@clerk/express';



// dotenv.config();
// // Initialize Express
// const app = express();

// // Connect to MongoDB
// await connectDB();
// await connectCloudinary();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(clerkMiddleware());


// // Routes
// app.get("/", (req, res) => res.send("API Working"));

// Sentry.setupExpressErrorHandler(app);

// app.get("/debug-sentry", function mainHandler(req, res) {
//     throw new Error("My first Sentry error!");
//   });
// app.post('/webhooks',clerkWebhooks)
// app.use('/api/company',companyRoutes)
// app.use('/api/jobs', JobRoutes)
// app.use('/api/users', userRoutes)

// // Start the server
// const port = process.env.PORT || 3000;
// app.listen(port, () => console.log(`Server running on port ${port}`));


import './config/instrument.js'
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";
import { clerkWebhooks } from './controller/webhooks.js';
import companyRoutes from './routes/companyRoutes.js';
import JobRoutes from './routes/jobRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { clerkMiddleware } from '@clerk/express';
import * as Sentry from "@sentry/node";

dotenv.config();
const app = express();

await connectDB();
await connectCloudinary();

app.use(cors());

// 1️⃣ RAW WEBHOOK ROUTE (MUST COME FIRST)
app.post(
  "/webhooks",
  express.raw({ type: "*/*" }),
  clerkWebhooks
);

// 2️⃣ Normal JSON for all other routes
app.use(express.json());

// 3️⃣ Clerk Protected Routes
app.use(clerkMiddleware());

// 4️⃣ API ROUTES
app.get("/", (req, res) => res.send("API Working"));
app.use('/api/company', companyRoutes);
app.use('/api/jobs', JobRoutes);
app.use('/api/users', userRoutes);



// Sentry
Sentry.setupExpressErrorHandler(app);

// Start Server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
