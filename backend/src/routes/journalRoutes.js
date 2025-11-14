// src/routes/journalRoutes.js
const express = require("express");
const {
  createJournalEntry,
  getJournalEntry,
  getUserJournalEntries,
  getPublicJournalEntries,
  updateJournalEntry,
  deleteJournalEntry,
  getJournalAnalytics,
} = require("../controllers/journalController");
const { auth, optionalAuth } = require("../middleware/auth");
const { validateJournalEntry } = require("../middleware/validation");

const router = express.Router();

// Public routes (optional auth for public entries)
router.get("/public", optionalAuth, getPublicJournalEntries);

// Protected routes (require auth)
router.use(auth);

router.post("/", validateJournalEntry, createJournalEntry);
router.get("/", getUserJournalEntries);
router.get("/analytics", getJournalAnalytics);
router.get("/:id", getJournalEntry);
router.put("/:id", validateJournalEntry, updateJournalEntry);
router.delete("/:id", deleteJournalEntry);

module.exports = router;
