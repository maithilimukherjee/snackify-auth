import { pool } from "../config/db.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { transporter } from "../config/mailer.js";
import jwt from "jsonwebtoken";

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

const generate2FACode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
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

    //4, generate 2FA code and expiry
    const code = generate2FACode();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    //5. store code and expiry in DB
    await pool.query(
      "UPDATE users SET twofa_code=$1, twofa_expiry=$2 WHERE id=$3",
      [code, expiry, user.id]
    );

    //6. send code to user 
    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: email,
      subject: "Your 2FA Code",
      text: `Your 2FA code is ${code}. It expires in 10 minutes.`,
    });

    //7. respond to client
    res.status(200).json({ message: "2FA code sent to ur email" });
  } catch (error) {
    console.error("login error:", error);
    res.status(500).json({ message: "server error" });
  }
};

export const verify2FA = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: "email and code required" });
    }

    const existing = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (existing.rows.length === 0) {
      return res.status(400).json({ message: "invalid credentials" });
    }

    const user = existing.rows[0];

    if (user.twofa_code !== code) {
      return res.status(400).json({ message: "invalid 2FA code" });
    }

    if (new Date() > new Date(user.twofa_expiry)) {
      return res.status(400).json({ message: "2FA code expired" });
    }

    // clear 2fa code
    await pool.query(
      "UPDATE users SET twofa_code=NULL, twofa_expiry=NULL WHERE id=$1",
      [user.id]
    );

    // generate jwt
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    res.status(200).json({ 
      message: "2FA verification successful",
      token 
    });

  } catch (error) {
    console.error("verify2FA error:", error);
    res.status(500).json({ message: "server error" });
  }
};
 
export const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "unauthorized" });
    }
    
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded;
    next();
  }
  catch (error) {
    console.error("auth middleware error:", error);
    res.status(401).json({ message: "unauthorized" });
  }
};


