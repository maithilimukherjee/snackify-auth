import express from "express";
import { register, login, verify2FA, auth } from "../controllers/authController.js";
import { pool } from "../config/db.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify2fa", verify2FA);
router.get("/profile", auth, async (req, res) => {
  const data = await pool.query("SELECT * FROM users WHERE id=$1", [
    req.user.id,
  ]);

  res.json(data.rows[0]);
});

export default router;
