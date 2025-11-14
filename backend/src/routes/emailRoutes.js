const express = require("express");
const {
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
} = require("../controllers/emailController");
const {
  validateEmail,
  validatePasswordReset,
} = require("../middleware/validation");

const router = express.Router();

router.post("/verify-email", verifyEmail);
router.post("/resend-verification", validateEmail, resendVerification);
router.post("/forgot-password", validateEmail, forgotPassword);
router.post("/reset-password", validatePasswordReset, resetPassword);

module.exports = router;
