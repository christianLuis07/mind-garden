const authService = require("../services/authService");
const { successResponse, errorResponse } = require("../utils/response");

const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;
    const result = await authService.verifyEmail(token);

    successResponse(res, result.message, { user: result.user });
  } catch (error) {
    next(error);
  }
};

const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await authService.resendVerificationEmail(email);

    successResponse(res, result.message);
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);

    successResponse(res, result.message);
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    const result = await authService.resetPassword(token, newPassword);

    successResponse(res, result.message);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
};
