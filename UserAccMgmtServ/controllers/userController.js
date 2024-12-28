import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

// Helper function to log messages
const logMessage = async (req, message) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress || "Unknown IP";
  const logData = { message: `${ip} - ${message}` };

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

/**
 * @desc   Get all users
 * @route  GET /api/user
 * @access Private/Admin
 */
const getUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find().select("-password");
    if (!users || users.length === 0) {
      await logMessage(req, "Attempted to fetch users but none were found.");
      res.status(404).json({ msg: "No users found" });
      throw new Error("No users found");
    }
    await logMessage(req, "Fetched all users successfully.");
    res.status(200).json(users);
  } catch (error) {
    await logMessage(req, `Error while fetching users: ${error.message}`);
    throw error;
  }
});

/**
 * @desc   Get a single user by ID
 * @route  GET /api/user/:id
 * @access Private
 */
const getUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      await logMessage(req, `No user found with ID ${req.params.id}.`);
      res.status(404).json({ msg: "No user found" });
      throw new Error("No user found");
    }
    await logMessage(req, `Fetched user with ID ${req.params.id} successfully.`);
    res.status(200).json(user);
  } catch (error) {
    await logMessage(req, `Error while fetching user by ID ${req.params.id}: ${error.message}`);
    throw error;
  }
});

/**
 * @desc   Register a new user
 * @route  POST /api/user/register
 * @access Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      await logMessage(req, "Attempted registration with incomplete fields.");
      res.status(400).json({ msg: "Enter all fields" });
      throw new Error("Incomplete fields");
    }

    const isEmail = await User.findOne({ email });
    if (isEmail) {
      await logMessage(req, `Registration failed: Email ${email} already in use.`);
      res.status(400).json({ msg: "Email already in use" });
      throw new Error("Email already in use");
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = await User.create({ username, email, password: hashedPassword });

    if (newUser) {
      await logMessage(req, `Registered user with ID ${newUser.id} successfully.`);
      res.status(201).json({ _id: newUser.id, username: newUser.username });
    } else {
      await logMessage(req, "Registration failed: Could not create user.");
      res.status(400).json({ msg: "Could not create user" });
      throw new Error("User not created");
    }
  } catch (error) {
    await logMessage(req, `Error while registering user: ${error.message}`);
    throw error;
  }
});

/**
 * @desc   Update user information
 * @route  PUT /api/user/:id
 * @access Private
 */
const updateUser = asyncHandler(async (req, res) => {
  try {
    const auth = req.user;

    if (auth.id !== req.params.id) {
      await logMessage(req, `Unauthorized attempt to update user ID ${req.params.id}.`);
      res.status(401).json({ msg: "Unauthorized" });
      throw new Error("Unauthorized");
    }

    const user = await User.findById(req.params.id);

    if (user) {
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;

      if (req.body.password) {
        const salt = bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync(req.body.password, salt);
      }

      const updatedUser = await user.save();
      await logMessage(req, `Updated user with ID ${req.params.id} successfully.`);
      res.status(200).json({
        _id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
      });
    } else {
      await logMessage(req, `User with ID ${req.params.id} not found for update.`);
      res.status(404).json({ msg: "User not found" });
      throw new Error("User not found");
    }
  } catch (error) {
    await logMessage(req, `Error while updating user ID ${req.params.id}: ${error.message}`);
    throw error;
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

  try {
    if (typeof storageUsed !== "number") {
      await logMessage(req, `Invalid storage amount provided for user ID ${userId}.`);
      return res.status(400).json({ error: "Invalid storage amount provided." });
    }

    const user = await User.findById(userId);
    if (!user) {
      await logMessage(req, `User with ID ${userId} not found for storage update.`);
      return res.status(404).json({ error: "User not found." });
    }
    if (user.accountStatus !== "active") {
      await logMessage(req, `Restricted user ID ${userId} attempted to update storage.`);
      return res.status(400).json({ error: "User account is restricted." });
    }

    if (user.storageUsed + storageUsed > 50) {
      await logMessage(req, `User ID ${userId} exceeded storage limit.`);
      return res.status(400).json({ error: "User storage limit exceeded." });
    }

    user.storageUsed += storageUsed;
    await user.save();

    await logMessage(req, `Updated storage for user ID ${userId} successfully.`);
    res.status(200).json({
      message: "User storage updated successfully.",
      user: {
        id: user._id,
        username: user.username,
        storageUsed: user.storageUsed,
      },
    });
  } catch (error) {
    await logMessage(req, `Error while updating storage for user ID ${userId}: ${error.message}`);
    throw error;
  }
});

/**
 * @desc   Update a user's account status
 * @route  PUT /api/user/:userId/status
 * @access Admin
 */
const updateAccountStatus = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { accountStatus } = req.body;

  try {
    if (!["active", "restricted"].includes(accountStatus)) {
      await logMessage(req, `Invalid account status '${accountStatus}' provided for user ID ${userId}.`);
      return res.status(400).json({ error: "Invalid account status provided." });
    }

    const user = await User.findById(userId);

    if (!user) {
      await logMessage(req, `User with ID ${userId} not found for status update.`);
      return res.status(404).json({ error: "User not found." });
    }

    user.accountStatus = accountStatus;
    await user.save();

    await logMessage(req, `Updated account status for user ID ${userId} to '${accountStatus}'.`);
    res.status(200).json({
      message: "User account status updated successfully.",
      user: {
        id: user._id,
        username: user.username,
        accountStatus: user.accountStatus,
      },
    });
  } catch (error) {
    await logMessage(req, `Error while updating account status for user ID ${userId}: ${error.message}`);
    throw error;
  }
});

/**
 * @desc   Bulk update all users' account statuses
 * @route  PUT /api/user/status
 * @access Admin
 */
const updateAllAccountStatuses = asyncHandler(async (req, res) => {
  const { accountStatus } = req.body;

  try {
    if (!["active", "restricted"].includes(accountStatus)) {
      await logMessage(req, `Invalid bulk account status '${accountStatus}' provided.`);
      return res.status(400).json({ error: "Invalid account status provided." });
    }

    const users = await User.find();

    for (let i = 0; i < users.length; i++) {
      users[i].accountStatus = accountStatus;
      await users[i].save();
    }

    await logMessage(req, `Bulk updated account statuses to '${accountStatus}' for all users.`);
    res.status(200).json({
      message: "All user account statuses updated successfully.",
    });
  } catch (error) {
    await logMessage(req, `Error while bulk updating account statuses: ${error.message}`);
    throw error;
  }
});

export {
  getUsers,
  getUser,
  registerUser,
  updateUser,
  updateStorage,
  updateAccountStatus,
  updateAllAccountStatuses,
};
