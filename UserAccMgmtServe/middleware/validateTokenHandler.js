import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

const validateTokenHandler = asyncHandler(async (req, res, next) => {
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
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    res.status(401);
    throw new Error("Unauthorized: Invalid or expired token");
  }
});

export default validateTokenHandler