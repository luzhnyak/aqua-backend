const jwt = require("jsonwebtoken");
const { serverConfig } = require("../../configs");

exports.signToken = (id) =>
  jwt.sign({ id }, serverConfig.jwtSecret, {
    expiresIn: serverConfig.jwtExpires,
  });

exports.singRefreshToken = (id) =>
  jwt.sign({ id }, serverConfig.refreshJwtTokenSecret, {
    expiresIn: serverConfig.refreshJwtTokenExpires,
  });

exports.checkToken = (token) => {
  if (!token) throw HttpError(401, "Not authorized");

  try {
    const { id } = jwt.verify(token, serverConfig.jwtSecret);

    return id;
  } catch (err) {
    throw HttpError(401, "Not authorized");
  }
};

exports.checkRefreshToken = (token) => {
  if (!token) throw HttpError(400, "Refresh token not detected");

  const { id } = jwt.verify(token, serverConfig.refreshJwtTokenSecret);
  console.log("Check refresh OK");
  return id;
};
