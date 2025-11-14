// src/routes/supportRoutes.js
const express = require("express");
const {
  createSupportGroup,
  getSupportGroups,
  getSupportGroup,
  joinSupportGroup,
  leaveSupportGroup,
  getGroupMessages,
  createGroupMessage,
  getUserSupportGroups,
} = require("../controllers/supportController");
const { auth, optionalAuth } = require("../middleware/auth");

const router = express.Router();

// Public routes (support groups listing)
router.get("/groups", optionalAuth, getSupportGroups);

// Protected routes
router.use(auth);

router.post("/groups", createSupportGroup);
router.get("/groups/user", getUserSupportGroups);
router.get("/groups/:id", getSupportGroup);
router.post("/groups/:id/join", joinSupportGroup);
router.post("/groups/:id/leave", leaveSupportGroup);
router.get("/groups/:id/messages", getGroupMessages);
router.post("/groups/:id/messages", createGroupMessage);

module.exports = router;
