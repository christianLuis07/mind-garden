const journalService = require("../services/journalService");
const { successResponse, errorResponse } = require("../utils/response");

const createJournalEntry = async (req, res, next) => {
  try {
    const journalEntry = await journalService.createJournalEntry(
      req.user.id,
      req.body,
      req.files
    );

    successResponse(
      res,
      "Journal entry created successfully",
      { journalEntry },
      201
    );
  } catch (error) {
    next(error);
  }
};

const getJournalEntry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const journalEntry = await journalService.getJournalEntryById(
      req.user.id,
      id
    );

    successResponse(res, "Journal entry retrieved successfully", {
      journalEntry,
    });
  } catch (error) {
    next(error);
  }
};

const getUserJournalEntries = async (req, res, next) => {
  try {
    const result = await journalService.getUserJournalEntries(
      req.user.id,
      req.query
    );

    successResponse(res, "Journal entries retrieved successfully", result);
  } catch (error) {
    next(error);
  }
};

const getPublicJournalEntries = async (req, res, next) => {
  try {
    const result = await journalService.getPublicJournalEntries(req.query);

    successResponse(
      res,
      "Public journal entries retrieved successfully",
      result
    );
  } catch (error) {
    next(error);
  }
};

const updateJournalEntry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const journalEntry = await journalService.updateJournalEntry(
      req.user.id,
      id,
      req.body,
      req.files
    );

    successResponse(res, "Journal entry updated successfully", {
      journalEntry,
    });
  } catch (error) {
    next(error);
  }
};

const deleteJournalEntry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await journalService.deleteJournalEntry(req.user.id, id);

    successResponse(res, result.message);
  } catch (error) {
    next(error);
  }
};

// Controller baru untuk hapus gambar
const deleteJournalImage = async (req, res, next) => {
  try {
    const { id, index } = req.params;
    const result = await journalService.deleteJournalImage(
      req.user.id,
      id,
      parseInt(index)
    );

    successResponse(res, result.message, { images: result.images });
  } catch (error) {
    next(error);
  }
};

const getJournalAnalytics = async (req, res, next) => {
  try {
    const { timeframe = "30d" } = req.query;
    const analytics = await journalService.getJournalAnalytics(
      req.user.id,
      timeframe
    );

    successResponse(res, "Journal analytics retrieved successfully", {
      analytics,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createJournalEntry,
  getJournalEntry,
  getUserJournalEntries,
  getPublicJournalEntries,
  updateJournalEntry,
  deleteJournalEntry,
  deleteJournalImage,
  getJournalAnalytics,
};
