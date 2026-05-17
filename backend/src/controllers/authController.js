const authService = require("../services/authService");
const { successResponse, errorResponse } = require("../utils/response");

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);

    successResponse(res, "User registered successfully", result, 201);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);

    successResponse(res, "Login successful", result);
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.user.id);

    successResponse(res, "User retrieved successfully", { user });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await authService.updateProfile(req.user.id, req.body, req.file);

    successResponse(res, "Profile updated successfully", { user });
  } catch (error) {
    next(error);
  }
};

const setupTotp = async (req, res, next) => {
  try {
    const result = await authService.setupTotp(req.user.id);
    successResponse(res, "TOTP setup initiated", result);
  } catch (error) {
    next(error);
  }
};

const verifyTotp = async (req, res, next) => {
  try {
    const { token } = req.body;
    const result = await authService.verifyTotpSetup(req.user.id, token);
    successResponse(res, "TOTP verified successfully", result);
  } catch (error) {
    next(error);
  }
};

const validateTotpLogin = async (req, res, next) => {
  try {
    const { tempToken, token } = req.body;
    const result = await authService.validateTotpLogin(tempToken, token);
    successResponse(res, "Login successful", result);
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const result = await authService.changePassword(req.user.id, oldPassword, newPassword);
    successResponse(res, "Kata sandi berhasil diubah", result);
  } catch (error) {
    next(error);
  }
};

const deleteAccount = async (req, res, next) => {
  try {
    const result = await authService.deleteAccount(req.user.id);
    successResponse(res, "Akun berhasil dihapus", result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  setupTotp,
  verifyTotp,
  validateTotpLogin,
  changePassword,
  deleteAccount,
};
