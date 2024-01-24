const multer = require("multer");
const path = require("path");
const { HttpError } = require("../helpers");

const tenpDir = path.join(__dirname, "../", "tmp");

const multerConfig = multer.diskStorage({
  destination: tenpDir,
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: multerConfig,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.includes("image")) {
      cb(HttpError(400, "This file type is not supported"));
    }
    cb(null, true);
  },
});

module.exports = upload;
