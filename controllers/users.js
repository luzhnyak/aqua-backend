const User = require("../db/models/user");
const { HttpError, ctrlWrapper } = require("../helpers");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const { v4: uuidv4 } = require("uuid");
const sendEmail = require("../middlewares/sendEmail");
const { userServices } = require("../db/services");
const avatarDir = path.join(__dirname, "../", "public", "avatars");

require("dotenv").config();
const { BASE_URL } = process.env;

// ============================== Register

const registerUser = async (req, res) => {
  const { user } = await userServices.createNewUser(req.body);

  const verifyEmail = {
    to: user.email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Click verify email</a>`,
  };

  // sendEmail(verifyEmail);

  res.status(201).json({
    user: { email: user.email },
  });
};

// ============================== Verify email

const verifyEmail = async (req, res) => {
  await userServices.verifyEmail(req.params.verificationToken);

  res.status(200).json({ message: "Verification successful" });
};

// ============================== Login

const loginUser = async (req, res) => {
  const { token, user } = await userServices.login(req.body);

  res.status(200).json({
    user,
    token,
  });
};

// ============================== Get current User
const getCurrentUser = async (req, res) => {
  const user = await userServices.getCurrentUser(req.user.id);

  res.json({ user });
};

// ============================== Logout User

const logoutUser = async (req, res) => {
  await userServices.logout(req.user);

  res.status(204).send();
};

// ============================== Update water rate

const updateUserWaterRate = async (req, res) => {
  const user = await userServices.updateUserWaterRate(req.user.id, req.body);

  res.status(200).json(user);
};

// ============================== Update User Data

const updateUserData = async (req, res) => {
  const user = await userServices.updateUserData(req.user.id, req.body);

  res.status(200).json(user);
};

// ============================== Update avatar

const updateAvatar = async (req, res) => {
  const user = await userServices.updateAvatar(req.user.id, req.file);

  const avatarURL = user.avatarURL;

  res.json({
    avatarURL,
  });
};

// ============================== Resend verify email

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Click verify email</a>`,
  };

  sendEmail(verifyEmail);

  res.status(200).json({ message: "Verification email sent" });
};

module.exports = {
  getCurrentUser: ctrlWrapper(getCurrentUser),
  registerUser: ctrlWrapper(registerUser),
  loginUser: ctrlWrapper(loginUser),
  logoutUser: ctrlWrapper(logoutUser),
  updateUserData: ctrlWrapper(updateUserData),
  updateUserWaterRate: ctrlWrapper(updateUserWaterRate),
  updateAvatar: ctrlWrapper(updateAvatar),
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
};
