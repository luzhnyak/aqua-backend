const serverConfig = {
  jwtSecret: process.env.SECRET ?? "secret-phrase",
  jwtExpires: process.env.JWT_EXPIRES ?? "14d",
};

module.exports = serverConfig;
