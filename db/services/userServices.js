const { v4: uuidv4 } = require("uuid");
const { serverConfig } = require("../../configs");
const { HttpError } = require("../../helpers");
const User = require("../models/user");
const { signToken } = require("./jwtServices");
const Email = require("./emailServices");

// ============================== Create New User

exports.createNewUser = async (userData) => {
  const { email } = userData;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const newUser = await User.create({
    ...userData,
    verificationToken: uuidv4(),
  });

  newUser.password = undefined;

  return {
    user: {
      email: newUser.email,
      verificationToken: newUser.verificationToken,
    },
  };
};

// ============================== Verify Email

exports.verifyEmail = async (verificationToken) => {
  const user = await User.findOne({ verificationToken });

  if (!user) throw HttpError(404, "User not found");

  user.verificationToken = null;
  user.verify = true;

  await user.save();
};

// ============================== Resend Verify Email

exports.resendVerifyEmail = async (email) => {
  const user = await User.findOne({ email });

  if (!user) throw HttpError(404, "User not found");

  if (user.verify) throw HttpError(400, "Verification has already been passed");

  try {
    await new Email(
      user,
      `${serverConfig.frontEndUrl}/users/verify/${user.verificationToken}`
    ).sendHello();
  } catch (error) {
    console.log(error);
  }
};

// ============================== Login

exports.login = async (userData) => {
  const { email, password } = userData;

  const user = await User.findOne({ email }).select("+password");

  if (!user) throw HttpError(401, "Email or password is wrong");

  if (!user.verify) throw HttpError(403, "Verify your email");

  const passwdIsValid = await user.checkPassword(password, user.password);

  if (!passwdIsValid) throw HttpError(401, "Email or password is wrong");

  const token = signToken(user.id);

  user.token = token;

  await user.save();

  user.password = undefined;

  return {
    user: {
      email: user.email,
      gender: user.gender,
      name: user.name,
      waterRate: user.waterRate,
      avatarURL: user.avatarURL,
    },
    token,
  };
};

exports.authGoogle = async (userData) => {
  console.log(userData);
  const { email } = userData;

  let user = await User.findOne({ email }).select("+password");

  if (!user) {
    user = await User.create({
      name: userData.name,
      email,
      verify: true,
      password: "google12345",
      avatarURL: userData.picture,
    });
  }

  const token = signToken(user.id);

  user.token = token;

  await user.save();

  return token;
};

// ============================== Get Current User

exports.getCurrentUser = async (id) => {
  const user = await User.findById(id).select(
    "name email avatarURL waterRate gender createdAt"
  );

  return user;
};

// ============================== Logout

exports.logout = async (user) => {
  user.token = "";

  await user.save();
};

// ============================== Update Water Rate

exports.updateUserWaterRate = async (id, waterRateData) => {
  const user = await User.findById(id);
  user.waterRate = waterRateData.waterRate;

  return user.save();
};

// ============================== Update User Data

exports.updateUserData = async (id, userData) => {
  const user = await User.findById(id).select("+password");

  if ("password" in userData) {
    const isValidPassword = await user.checkPassword(
      userData.password,
      user.password
    );

    if (!isValidPassword) throw HttpError(401, "Password is wrong");

    user.password = userData.newPassword;
  }

  Object.keys(userData).forEach((key) => {
    if (key === "password" || key === "newPassword") {
      return;
    }
    user[key] = userData[key];
  });

  return user.save();
};

// ============================== Update Avatar

exports.updateAvatar = async (userId, avatar) => {
  if (!avatar) throw HttpError(400, "File is not found.");

  const user = await User.findById(userId);
  user.avatarURL = avatar.path;

  return user.save();
};

// ============================== Forgot Password

exports.forgotPassword = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  user.verificationToken = uuidv4();

  user.save();

  return user.verificationToken;
};

// ============================== Update User Password
exports.updateUserPasswordService = async (
  changePasswordToken,
  newPassword
) => {
  if (!changePasswordToken || !newPassword) {
    throw HttpError(400, "Bad request (invalid request body)");
  }

  const user = await User.findOne({ verificationToken: changePasswordToken });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  user.password = newPassword;
  user.verificationToken = null;

  await user.save();

  return user;
};
