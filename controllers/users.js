const { ctrlWrapper } = require("../helpers");
const { userServices, Email } = require("../db/services");
const { serverConfig } = require("../configs");

require("dotenv").config();

const registerUser = async (req, res) => {
  const { user } = await userServices.createNewUser(req.body);

  try {
    await new Email(
      user,
      `${serverConfig.frontEndUrl}/verify/${user.verificationToken}`
    ).sendHello();
  } catch (error) {
    console.log(error);
  }

  res.status(201).json({
    user: { email: user.email, language: user.language },
  });
};

const verifyEmail = async (req, res) => {
  await userServices.verifyEmail(req.params.verificationToken);

  res.status(200).json({ message: "Verification successful" });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;

  await userServices.resendVerifyEmail(email);

  res.status(200).json({ message: "Verification email sent" });
};

const loginUser = async (req, res) => {
  const { token, user, refreshToken } = await userServices.login(req.body);

  res.status(200).json({
    user,
    token,
    refreshToken,
  });
};

const refreshToken = async (req, res) => {
  const tokens = await userServices.refreshUserToken(req.body.refreshToken);
  res.json(tokens);
};

const getCurrentUser = async (req, res) => {
  const user = await userServices.getCurrentUser(req.user);

  res.json(user);
};

const logoutUser = async (req, res) => {
  await userServices.logout(req.user);

  res.status(204).send();
};

const updateUserWaterRate = async (req, res) => {
  const user = await userServices.updateUserWaterRate(req.user.id, req.body);

  res.status(200).json({
    waterRate: user.waterRate,
  });
};

const updateUserData = async (req, res) => {
  const user = await userServices.updateUserData(req.user.id, req.body);

  res.status(200).json({
    user: {
      gender: user.user.gender,
      name: user.user.name,
      email: user.user.email,
    },
    message: user.message,
  });
};

const updateAvatar = async (req, res) => {
  const user = await userServices.updateAvatar(req.user.id, req.file);

  const avatarURL = user.avatarURL;

  res.json({
    avatarURL,
  });
};

const forgotPassword = async (req, res) => {
  const user = await userServices.forgotPassword(req.body.email);

  try {
    await new Email(
      user,
      `${serverConfig.frontEndUrl}/update-password/${user.verificationToken}`
    ).forgotPass();
  } catch (error) {
    console.log(error);
  }

  res.status(200).json({
    message: "Password reset instructions have been sent to your email.",
  });
};

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
  refreshToken: ctrlWrapper(refreshToken),
};
