const serverConfig = {
  jwtSecret: process.env.SECRET_KEY ?? "secret-phrase",
  jwtExpires: process.env.JWT_EXPIRES ?? "15s",
  refreshJwtTokenSecret: process.env.REFRESH_SECRET_KEY ?? "secret-phrase",
  refreshJwtTokenExpires: process.env.REFRESH_SECRET_EXPIRES ?? "45s",
  cloudinaryName: process.env.CLOUDINARY_NAME ?? "some-name",
  cloudinaryKey: process.env.CLOUDINARY_KEY ?? "some-key",
  cloudinarySecret: process.env.CLOUDINARY_SECRET ?? "some-secret",
  metaEmailUser: process.env.META_MAIL ?? "some-email",
  metaEmailPass: process.env.META_PASS ?? "some-pass",
  frontEndUrl:
    process.env.FRONTEND_URL ?? "https://luzhnyak.github.io/aqua-frontend",
};

module.exports = serverConfig;
