const express = require("express");
const {
  register,
  login,
  getMe,
  updateProfile,
} = require("../controllers/authController");
const { auth } = require("../middleware/auth");
const { validateRegister, validateLogin } = require("../middleware/validation");

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.get("/me", auth, getMe);
router.put("/profile", auth, updateProfile);

module.exports = router;
