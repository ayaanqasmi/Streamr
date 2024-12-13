import express from "express";
import { getUsers, getUser, registerUser, updateUser } from "../controllers/userController.js"; // Adjust path as necessary
import validateTokenHandler from "../middleware/validateTokenHandler.js";

const router = express.Router();

// Route to get all users (excluding password)
router.get("/", getUsers);

// Route to get a single user by ID
router.get("/:id", getUser);

// Route to register a new user
router.post("/register", registerUser);

// Route to update user details (username, email, password)
router.put("/:id",validateTokenHandler, updateUser);

export default router;
