import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { validateToken } from "./authController.js";
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  if (!users || users.length === 0) {
    res.status(404).json({ msg: "No users found" });
    throw new Error("No users found");
  }
  res.status(200).json(users);
});

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404).json({ msg: "No user found" });
    throw new Error("No user found");
  }
  res.status(200).json(user);
});
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400).json({ msg: "enter all fields" });
    throw new Error("incomplete fields");
  }
  const isEmail = await User.findOne({ email });
  if (isEmail) {
    res.status(400).json * { msg: "email already in use" };
    throw new Error("already in use");
  }

  const salt = bcrypt.genSaltSync(10);
  const hpassword = bcrypt.hashSync(password, salt);

  const newUser = await User.create({
    username,
    email,
    password: hpassword,
  });
  if (newUser) {
    res.status(201).json({ _id: newUser.id, username: newUser.username });
  } else {
    res.status(400).json * { msg: "couldnt create user" };
    throw new Error("not created");
  }
});

const updateUser = asyncHandler(async (req, res) => {

  let auth=req.user;

  if (auth.user.id !== req.params.id) {
    res.status(401).json({ msg: "unauthorized" });
    throw new Error("unauthorized");
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
    res.status(200).json({
      _id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
    });
  } else {
    res.status(404).json({ msg: "user not found" });
    throw new Error("user not found");
  }
});



export { getUsers, getUser, registerUser, updateUser };
