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
    const user = await authService.updateProfile(req.user.id, req.body);

    successResponse(res, "Profile updated successfully", { user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
};
