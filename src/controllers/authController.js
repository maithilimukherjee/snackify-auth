import { pool } from "../config/db.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

export const register = async (req, res) => {
  try {
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

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "user already exists" });
    }

    // 3. hash password
    const hashed = await bcrypt.hash(password, 10);

    // 4. generate user id
    const id = uuidv4();

    // 5. insert into db
    await pool.query(
      "INSERT INTO users (id, email, password) VALUES ($1, $2, $3)",
      [id, email, hashed]
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
