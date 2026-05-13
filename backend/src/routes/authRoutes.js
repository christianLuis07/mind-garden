const express = require("express");
const {
  register,
  login,
  getMe,
  updateProfile,
  setupTotp,
  verifyTotp,
  validateTotpLogin,
} = require("../controllers/authController");
const { auth } = require("../middleware/auth");
const { validateRegister, validateLogin } = require("../middleware/validation");

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.get("/me", auth, getMe);
router.put("/profile", auth, updateProfile);

// TOTP routes
router.post("/totp/setup", auth, setupTotp);
router.post("/totp/verify", auth, verifyTotp);
router.post("/totp/validate", validateTotpLogin);

module.exports = router;
