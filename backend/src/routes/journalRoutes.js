const express = require("express");
const multer = require("multer");
const {
  createJournalEntry,
  getJournalEntry,
  getUserJournalEntries,
  getPublicJournalEntries,
  updateJournalEntry,
  deleteJournalEntry,
  deleteJournalImage, // Import controller baru
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

router.get("/public", optionalAuth, getPublicJournalEntries);

router.use(auth);

router.post(
  "/",
  upload.array("images", 5),
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

router.delete("/:id/images/:index", deleteJournalImage);

module.exports = router;
