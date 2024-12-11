import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ msg: "enter all fields" });
    throw new Error("incomplete fields");
  }

  const user = await User.findOne({ email });
  if (!user) {
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
    res.cookie("token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7200 * 1000, // in milliseconds
    });
    res.status(200).json({ token: accessToken });
  } else {
    res.status(400).json * { msg: "invalid credentials" };
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

    console.log("Decoded token:", decoded);

    res.status(200).json(decoded);
  } catch (err) {
    console.error("JWT verification failed:", err);
    res.status(401);
    throw new Error("Unauthorized: Invalid or expired token");
  }
});

export { login, validateToken };
