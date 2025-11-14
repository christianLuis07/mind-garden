const moodService = require("../services/moodService");
const { successResponse, errorResponse } = require("../utils/response");

const createMoodEntry = async (req, res, next) => {
  try {
    const moodEntry = await moodService.createMoodEntry(req.user.id, req.body);

    successResponse(res, "Mood entry created successfully", { moodEntry }, 201);
  } catch (error) {
    next(error);
  }
};

const getMoodEntries = async (req, res, next) => {
  try {
    const result = await moodService.getUserMoodEntries(req.user.id, req.query);

    successResponse(res, "Mood entries retrieved successfully", result);
  } catch (error) {
    next(error);
  }
};

const getMoodAnalytics = async (req, res, next) => {
  try {
    const { timeframe = "7d" } = req.query;
    const analytics = await moodService.getMoodAnalytics(
      req.user.id,
      timeframe
    );

    successResponse(res, "Mood analytics retrieved successfully", {
      analytics,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMoodEntry,
  getMoodEntries,
  getMoodAnalytics,
};
