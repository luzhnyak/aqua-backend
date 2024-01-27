const express = require("express");
const { validateBody, authenticate } = require("../../middlewares");
const upload = require("../../db/services/avatarServices");
const {
  userJoiSchema,
  userUpdateSchema,
  userEmailSchema,
  passwordJoiSchema,
} = require("../../schemas/userSchema");

const router = express.Router();

const ctrl = require("../../controllers/users");

router.post(
  "/register",
  validateBody.checkCreate(userJoiSchema),
  ctrl.registerUser
);

router.get("/verify/:verificationToken", ctrl.verifyEmail);

router.post(
  "/verify",
  validateBody.checkUpdate(userEmailSchema),
  ctrl.resendVerifyEmail
);

router.post("/login", validateBody.checkCreate(userJoiSchema), ctrl.loginUser);

router.get("/current", authenticate, ctrl.getCurrentUser);

router.post("/logout", authenticate, ctrl.logoutUser);

router.patch(
  "/avatar",
  authenticate,
  upload.single("avatar"),
  ctrl.updateAvatar
);

router.patch("/water-rate", authenticate, ctrl.updateUserWaterRate);

router.put(
  "/update-user",
  validateBody.checkCreate(userUpdateSchema),
  authenticate,
  ctrl.updateUserData
);

router.post("/forgot-password", validateBody.checkUpdate(userEmailSchema), ctrl.forgotPassword)

router.post("/forgot-password/:changePasswordToken", validateBody.checkCreate(passwordJoiSchema), ctrl.changePassword)

module.exports = router;
