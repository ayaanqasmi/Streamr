import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

// Helper function to log messages
const logMessage = async (req, message) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress || "Unknown IP";
  const logData = { message: `${ip} ${message}` };

  try {
    await fetch("https://logserv-1012918474165.us-central1.run.app/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logData),
    });
  } catch (error) {
    console.error("Failed to send log message:", error.message);
  }
};

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    await logMessage(req, `Unauthorized attempt to login with email ${email}.`);
    res.status(400).json({ msg: "enter all fields" });
    throw new Error("incomplete fields");
  }

  const user = await User.findOne({ email });
  if (!user) {
    await logMessage(req, `Unauthorized attempt to login with email ${email}.`);
    res.status(401).json({ msg: "no user with that email exists" });
    throw new Error("no user exists");
  }
  if (user && bcrypt.compareSync(password, user.password)) {
    
    var accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "120m" }
    );

    await logMessage(req, `User with email ${email} logged in successfully.`);
    res.status(200).json({ token: accessToken });
  } else {
    await logMessage(req, `Unauthorized attempt to login with email ${email}.`);
    res.status(400).json({ msg: "invalid credentials" });
    throw new Error("invalid credentials");
  }
});

const validateToken = asyncHandler(async (req, res) => {
  let userToken;
  const authHeader = req.headers.authorization;

  // Check if Authorization header exists and follows "Bearer <token>" format
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401);
    throw new Error("Unauthorized: Missing or invalid Authorization header");
  }

  // Extract the token
  userToken = authHeader.split(" ")[1];
  if (!userToken) {
    res.status(401);
    throw new Error("Unauthorized: Token missing in Authorization header");
  }

  try {
    // Verify the token
    const decoded = jwt.verify(userToken, process.env.ACCESS_TOKEN_SECRET);

    res.status(200).json(decoded);
  } catch (err) {
    console.error("JWT verification failed:", err);
    res.status(401);
    throw new Error("Unauthorized: Invalid or expired token");
  }
});

export { login, validateToken };
