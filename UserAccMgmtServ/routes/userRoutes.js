import express from "express";
import {
  getUsers,
  getUser,
  registerUser,
  updateUser,
  updateStorage,
  updateAccountStatus,
  updateAllAccountStatuses,
} from "../controllers/userController.js"; // Adjust path as necessary
import validateTokenHandler from "../middleware/validateTokenHandler.js";
import validateApiKey from "../middleware/validateAPIKey.js";

const router = express.Router();

/**
 * @route   GET /api/user/
 * @desc    Get all users (excluding password)
 * @access  Public
 */
router.get("/", getUsers);

/**
 * @route   POST /api/user/register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", registerUser);

/**
 * @route   PUT /api/user/accountStatus
 * @desc    Update all users' account status (active/inactive)
 * @access  Private (requires API key validation)
 */
router.put("/accountStatus", validateApiKey, updateAllAccountStatuses);

/**
 * @route   PUT /api/user/accountStatus/:userId
 * @desc    Update a single user's account status (active/inactive)
 * @access  Private (requires API key validation)
 */
router.put("/accountStatus/:userId", validateApiKey, updateAccountStatus);
/**
 * @route   GET /api/user/:id
 * @desc    Get a single user by ID
 * @access  Public
 */
/**
 * @route   PUT /api/user/storage/:userId
 * @desc    Update user's storage usage
 * @access  Private (requires API key validation)
 */
router.put("/storage/:userId", validateApiKey, updateStorage);

router.get("/:id", getUser);

/**
 * @route   PUT /api/user/:id
 * @desc    Update user details (username, email, password)
 * @access  Private (requires token validation)
 */
router.put("/:id", validateTokenHandler, updateUser);



export default router;
