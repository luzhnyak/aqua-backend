const serverConfig = {
  jwtSecret: process.env.SECRET_KEY ?? "secret-phrase",
  jwtExpires: process.env.JWT_EXPIRES ?? "14d",
  cloudinaryName: process.env.CLOUDINARY_NAME ?? "some-name",
  cloudinaryKey: process.env.CLOUDINARY_KEY ?? "some-key",
  cloudinarySecret: process.env.CLOUDINARY_SECRET ?? "some-secret",
};

module.exports = serverConfig;
