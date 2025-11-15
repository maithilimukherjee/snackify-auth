import { pool } from "../config/db.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

export const register = async (req, res) => {
  try {
    const { name, email, password, food_pref } = req.body;

    if (!email || !password || !name || !food_pref) {
      return res.status(400).json({ message: "fields cannot be empty!" });
    }

    console.log({ name, email, password, food_pref });

    const existing = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "user already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const id = uuidv4();

    await pool.query(
      "INSERT INTO users (id, email, password, food_pref, name) VALUES ($1, $2, $3, $4, $5)",
      [id, email, hashed, food_pref, name]
    );

    res.status(201).json({ message: "user registered successfully" });

  } catch (error) {
    console.error("register error:", error);
    res.status(500).json({ message: "server error" });
  }
};

export const login = async (req, res) => {
  try{

    const { email, password } = req.body;

    // 1. validate input
    if (!email || !password) {
      return res.status(400).json({ message: "email and password required" });
    }

    // 2. check if user exists
    const existing = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (existing.rows.length === 0) {
      return res.status(400).json({ message: "invalid credentials" });
    }

    const user = existing.rows[0];

    // 3. compare password
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: "invalid credentials" });
    }

    // 4. successful login
    res.status(200).json({ message: "login successful" });
  } catch (error) {
    console.error("login error:", error);
    res.status(500).json({ message: "server error" });
  }
};


