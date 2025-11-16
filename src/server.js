import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import recommendRoute from "./routes/recommendRoutes.js";

dotenv.config(); // ALWAYS first

const app = express();

// middleware
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api", recommendRoute);

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("we are live on port", PORT);
});

