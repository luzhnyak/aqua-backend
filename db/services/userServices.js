const { v4: uuidv4 } = require("uuid");
const { HttpError } = require("../../helpers");
const User = require("../models/user");
const { signToken } = require("./jwtServices");

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

exports.verifyEmail = async (verificationToken) => {
  const user = await User.findOne({ verificationToken });

  if (!user) throw HttpError(404, "User not found");

  user.verificationToken = null;
  user.verify = true;

  await user.save();
};

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
  user.token = undefined; //====>Це тимчасово

  return {
    user,
    token,
  };
};

exports.getCurrentUser = async (id) => {
  const user = await User.findById(id).select(
    "name email avatarURL waterRate gender"
  );

  return user;
};

exports.logout = async (user) => {
  user.token = "";

  await user.save();
};

exports.updateUserWaterRate = async (id, waterRateData) => {
  const user = await User.findById(id);
  user.waterRate = waterRateData.waterRate;

  return user.save();
};

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
