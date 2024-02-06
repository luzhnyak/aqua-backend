const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const { serverConfig } = require("../../configs");

cloudinary.config({
  cloud_name: serverConfig.cloudinaryName,
  api_key: serverConfig.cloudinaryKey,
  api_secret: serverConfig.cloudinarySecret,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const fileName = `${req.user.id}-${uuidv4()}`;
    return {
      folder: "avatars",
      allowed_formats: ["jpg", "png"],
      public_id: fileName,
      transformation: [
        { width: 350, height: 350, crop: "fill" },
        { width: 700, height: 700, crop: "fill" },
      ],
    };
  },
});

const upload = multer({ storage });

module.exports = upload;
