// src/app.js
import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// middleware
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);

export default app;
