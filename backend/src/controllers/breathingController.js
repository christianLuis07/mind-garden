const breathingService = require("../services/breathingService");
const { successResponse, errorResponse } = require("../utils/response");

const createBreathingSession = async (req, res, next) => {
  try {
    const breathingSession = await breathingService.createBreathingSession(
      req.user.id,
      req.body
    );

    successResponse(
      res,
      "Breathing session completed successfully",
      { breathingSession },
      201
    );
  } catch (error) {
    next(error);
  }
};

const getBreathingSessions = async (req, res, next) => {
  try {
    const result = await breathingService.getUserBreathingSessions(
      req.user.id,
      req.query
    );

    successResponse(res, "Breathing sessions retrieved successfully", result);
  } catch (error) {
    next(error);
  }
};

const getBreathingAnalytics = async (req, res, next) => {
  try {
    const { timeframe = "30d" } = req.query;
    const analytics = await breathingService.getBreathingAnalytics(
      req.user.id,
      timeframe
    );

    successResponse(res, "Breathing analytics retrieved successfully", {
      analytics,
    });
  } catch (error) {
    next(error);
  }
};

const getBreathingTechniques = async (req, res, next) => {
  try {
    const techniques = breathingService.getBreathingTechniques();

    successResponse(res, "Breathing techniques retrieved successfully", {
      techniques,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBreathingSession,
  getBreathingSessions,
  getBreathingAnalytics,
  getBreathingTechniques,
};
