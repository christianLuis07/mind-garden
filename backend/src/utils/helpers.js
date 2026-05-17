const crypto = require("crypto");

const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString("hex");
};

const sanitizeUser = (user) => {
  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
};

const calculateMoodStats = (moodEntries) => {
  if (!moodEntries.length) return null;

  const averageMood =
    moodEntries.reduce((sum, entry) => sum + entry.mood, 0) /
    moodEntries.length;
  const moodCounts = moodEntries.reduce((counts, entry) => {
    counts[entry.mood] = (counts[entry.mood] || 0) + 1;
    return counts;
  }, {});

  return {
    averageMood: parseFloat(averageMood.toFixed(2)),
    totalEntries: moodEntries.length,
    moodDistribution: moodCounts,
  };
};

module.exports = {
  generateRandomString,
  sanitizeUser,
  calculateMoodStats,
};
