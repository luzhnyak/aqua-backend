const express = require("express");
const { validateBody, authenticate, upload } = require("../../middlewares");
const {
  userJoiSchema,
  userSubscriptionSchema,
  userEmailSchema,
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

// router.patch(
//   "/",
//   authenticate,
//   validateBody.checkUpdate(userSubscriptionSchema),
//   ctrl.updateSubscription
// );

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  ctrl.updateAvatar
);

router.patch("/water-rate", authenticate, ctrl.updateUserWaterRate);

router.patch("/update-user", authenticate, ctrl.updateUserData);

module.exports = router;
