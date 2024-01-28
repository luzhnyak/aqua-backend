const express = require("express");
const { googleAuth, googleRedirect } = require("../../controllers/google");

const router = express.Router();

router.get("/google", googleAuth);

router.get("/google-redirect", googleRedirect);

module.exports = router;
