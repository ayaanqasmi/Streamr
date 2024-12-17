import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

// Controller Functions for API Endpoints: api/user/*

/**
 * @desc   Get all users
 * @route  GET /api/user
 * @access Private/Admin
 */
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password"); // Exclude passwords from response
  if (!users || users.length === 0) {
    res.status(404).json({ msg: "No users found" });
    throw new Error("No users found");
  }
  res.status(200).json(users);
});

/**
 * @desc   Get a single user by ID
 * @route  GET /api/user/:id
 * @access Private
 */
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    res.status(404).json({ msg: "No user found" });
    throw new Error("No user found");
  }
  res.status(200).json(user);
});

/**
 * @desc   Register a new user
 * @route  POST /api/user/register
 * @access Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Input Validation
  if (!username || !email || !password) {
    res.status(400).json({ msg: "Enter all fields" });
    throw new Error("Incomplete fields");
  }

  // Check if email already exists
  const isEmail = await User.findOne({ email });
  if (isEmail) {
    res.status(400).json({ msg: "Email already in use" });
    throw new Error("Email already in use");
  }

  // Hash the password
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  // Create the user
  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  if (newUser) {
    res.status(201).json({ _id: newUser.id, username: newUser.username });
  } else {
    res.status(400).json({ msg: "Could not create user" });
    throw new Error("User not created");
  }
});

/**
 * @desc   Update user information
 * @route  PUT /api/user/:id
 * @access Private
 */
const updateUser = asyncHandler(async (req, res) => {
  const auth = req.user;

  // Authorization check
  if (auth.id !== req.params.id) {
    res.status(401).json({ msg: "Unauthorized" });
    throw new Error("Unauthorized");
  }

  const user = await User.findById(req.params.id);

  if (user) {
    // Update fields if provided
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      const salt = bcrypt.genSaltSync(10);
      user.password = bcrypt.hashSync(req.body.password, salt);
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
    });
  } else {
    res.status(404).json({ msg: "User not found" });
    throw new Error("User not found");
  }
});

/**
 * @desc   Update user storage
 * @route  PUT /api/user/:userId/storage
 * @access Private
 */
const updateStorage = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { storageUsed } = req.body;

  // Input Validation
  if (typeof storageUsed !== "number") {
    return res.status(400).json({ error: "Invalid storage amount provided." });
  }

  // Find user and validate status
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }
  if (user.accountStatus !== "active") {
    return res.status(400).json({ error: "User account is restricted." });
  }

  // Check storage limit
  if (user.storageUsed + storageUsed > 50) {
    return res.status(400).json({ error: "User storage limit exceeded." });
  }

  user.storageUsed += storageUsed;
  await user.save();

  res.status(200).json({
    message: "User storage updated successfully.",
    user: {
      id: user._id,
      username: user.username,
      storageUsed: user.storageUsed,
    },
  });
});

/**
 * @desc   Update a user's account status
 * @route  PUT /api/user/:userId/status
 * @access Admin
 */
const updateAccountStatus = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { accountStatus } = req.body;

  if (!["active", "restricted"].includes(accountStatus)) {
    return res.status(400).json({ error: "Invalid account status provided." });
  }

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  user.accountStatus = accountStatus;
  await user.save();

  res.status(200).json({
    message: "User account status updated successfully.",
    user: {
      id: user._id,
      username: user.username,
      accountStatus: user.accountStatus,
    },
  });
});

/**
 * @desc   Bulk update all users' account statuses
 * @route  PUT /api/user/status
 * @access Admin
 */
const updateAllAccountStatuses = asyncHandler(async (req, res) => {
  const { accountStatus } = req.body;

  if (!["active", "restricted"].includes(accountStatus)) {
    return res.status(400).json({ error: "Invalid account status provided." });
  }

  const users = await User.find();

  for (let i = 0; i < users.length; i++) {
    users[i].accountStatus = accountStatus;
    await users[i].save();
  }

  res.status(200).json({
    message: "All user account statuses updated successfully.",
  });
});

export  {
  getUsers,
  getUser,
  registerUser,
  updateUser,
  updateStorage,
  updateAccountStatus,
  updateAllAccountStatuses,
};
