import express from "express";
import { register, login, verify2FA } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify2fa", verify2FA);

export default router;
