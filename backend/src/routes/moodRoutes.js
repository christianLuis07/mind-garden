const express = require("express");
const {
  createMoodEntry,
  getMoodEntries,
  getMoodAnalytics,
} = require("../controllers/moodController");
const { auth } = require("../middleware/auth");
const { validateMoodEntry } = require("../middleware/validation");

const router = express.Router();

router.use(auth);

router.post("/", validateMoodEntry, createMoodEntry);
router.get("/", getMoodEntries);
router.get("/analytics", getMoodAnalytics);

module.exports = router;
