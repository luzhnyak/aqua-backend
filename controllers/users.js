const User = require("../db/models/user");
const { HttpError, ctrlWrapper } = require("../helpers");
const sendEmail = require("../middlewares/sendEmail");
const { userServices, Email } = require("../db/services");
const { serverConfig } = require("../configs");

require("dotenv").config();

// ============================== Register

const registerUser = async (req, res) => {
  const { user } = await userServices.createNewUser(req.body);

  try {
    await new Email(
      user,
      `${serverConfig.frontEndUrl}/users/verify/${user.verificationToken}`
    ).sendHello();
  } catch (error) {
    console.log(error);
  }

  res.status(201).json({
    user: { email: user.email },
  });
};

// ============================== Verify email

const verifyEmail = async (req, res) => {
  await userServices.verifyEmail(req.params.verificationToken);

  res.status(200).json({ message: "Verification successful" });
};

// ============================== Resend verify email

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;

  await userServices.resendVerifyEmail(email);

  res.status(200).json({ message: "Verification email sent" });
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

// ============================== Forgot Password Email

const forgotPassword = async (req, res) => {
  const user = await userServices.forgotPassword(req.body.email);

  try {
    await new Email(
      user,
      `${serverConfig.frontEndUrl}/forgot-password/${user.verificationToken}`
    ).forgotPass();
  } catch (error) {
    console.log(error);
  }

  res.status(200).json({
    message: "Password reset instructions have been sent to your email.",
  });
};

// ============================== Change Password Email

const changePassword = async (req, res) => {
  const { changePasswordToken } = req.params;
  const { newPassword } = req.body;

  await userServices.updateUserPasswordService(
    changePasswordToken,
    newPassword
  );

  res.status(200).json({ message: "Password changed successfully." });
};

module.exports = {
  changePassword: ctrlWrapper(changePassword),
  forgotPassword: ctrlWrapper(forgotPassword),
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
