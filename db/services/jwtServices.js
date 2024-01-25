const jwt = require("jsonwebtoken");
const { serverConfig } = require("../../configs");

exports.signToken = (id) =>
  jwt.sign({ id }, serverConfig.jwtSecret, {
    expiresIn: serverConfig.jwtExpires,
  });
