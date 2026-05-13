const express = require("express");
const { getStats, getUsers, toggleUserStatus } = require("../controllers/adminController");
const { auth } = require("../middleware/auth");
const { authorizeAdmin } = require("../middleware/adminAuth");

const router = express.Router();

// Apply auth and admin check to all admin routes
router.use(auth, authorizeAdmin);

router.get("/stats", getStats);
router.get("/users", getUsers);
router.patch("/users/:id/status", toggleUserStatus);

module.exports = router;
