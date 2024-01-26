const express = require("express");
const { validateBody, aunthenticate, upload } = require("../../middlewares");
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

router.get("/current", aunthenticate, ctrl.getCurrentUser);

router.post("/logout", aunthenticate, ctrl.logoutUser);

// router.patch(
//   "/",
//   aunthenticate,
//   validateBody.checkUpdate(userSubscriptionSchema),
//   ctrl.updateSubscription
// );

router.patch(
  "/avatars",
  aunthenticate,
  upload.single("avatar"),
  ctrl.updateAvatar
);

module.exports = router;
