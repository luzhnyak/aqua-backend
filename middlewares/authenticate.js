const jwt = require("jsonwebtoken");
const { HttpError, ctrlWrapper } = require("../helpers");
const User = require("../db/models/user");
const { serverConfig } = require("../configs");

const aunthenticate = ctrlWrapper(async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  
  if (bearer !== "Bearer") {
    next(HttpError(401));
  }
  
  try {
    
    const { id } = jwt.verify(token, serverConfig.jwtSecret);

    const user = await User.findById(id);

    if (!user || !user.token || user.token !== token) {
      next(HttpError(401));
    }

    req.user = user;
    next();
  } catch (error) {
    next(HttpError(401));
  }
});

module.exports = aunthenticate;
