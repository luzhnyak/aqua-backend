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

  if (!user) throw new HttpError(404, "User not found");

  user.verificationToken = null;
  user.verify = true;

  await user.save();
};

exports.login = async (userData) => {
  const { email, password } = userData;

  const user = await User.findOne({ email }).select("+password");

  if (!user.verify) throw new HttpError(403, "Verify your email");

  if (!user) throw new HttpError(401, "Email or password is wrong");

  const passwdIsValid = await user.checkPassword(password, user.password);

  if (!passwdIsValid) throw new HttpError(401, "Email or password is wrong");

  const token = signToken(user.id);

  user.token = token;

  await user.save();

  user.password = undefined;

  return {
    user: user.name
      ? { email: user.email, name: user.name }
      : { email: user.email },
    token,
  };
};

exports.logout = async (user) => {
  user.token = "";

  await user.save();
};
