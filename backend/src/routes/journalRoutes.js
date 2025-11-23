// src/routes/journalRoutes.js
const express = require("express");
const multer = require("multer");
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

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const parseJournalFormData = (req, res, next) => {
  if (req.body && req.body.data) {
    try {
      const parsedData = JSON.parse(req.body.data);
      req.body = { ...req.body, ...parsedData };
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Format data JSON tidak valid",
      });
    }
  }
  next();
};

// Public routes (optional auth for public entries)
router.get("/public", optionalAuth, getPublicJournalEntries);

// Protected routes (require auth)
router.use(auth);

router.post(
  "/",
  upload.array("gambar", 5),
  parseJournalFormData,
  validateJournalEntry,
  createJournalEntry
);
router.get("/", getUserJournalEntries);
router.get("/analytics", getJournalAnalytics);
router.get("/:id", getJournalEntry);
router.put(
  "/:id",
  upload.array("images", 5),
  parseJournalFormData,
  validateJournalEntry,
  updateJournalEntry
);
router.delete("/:id", deleteJournalEntry);

module.exports = router;
