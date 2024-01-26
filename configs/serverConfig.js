const serverConfig = {
  jwtSecret: process.env.SECRET_KEY ?? "secret-phrase",
  jwtExpires: process.env.JWT_EXPIRES ?? "14d",
};

module.exports = serverConfig;
