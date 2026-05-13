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
  createGroupImageMessage,
  getUserSupportGroups,
  inviteUser,
  promoteMember,
  removeMember,
  getGroupMembers,
} = require("../controllers/supportController");
const { auth, optionalAuth } = require("../middleware/auth");
const { uploadSupportMessageImage, handleUploadError } = require("../middleware/upload");

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
router.post("/groups/:id/messages/image", uploadSupportMessageImage.single("image"), handleUploadError, createGroupImageMessage);
router.post("/groups/:id/invite", inviteUser);
router.get("/groups/:id/members", getGroupMembers);
router.post("/groups/:id/members/promote", promoteMember);
router.delete("/groups/:id/members/:userId", removeMember);

module.exports = router;
