const adminService = require("../services/adminService");
const { successResponse, errorResponse } = require("../utils/response");

const getStats = async (req, res, next) => {
  try {
    const stats = await adminService.getDashboardStats();
    successResponse(res, "Dashboard stats retrieved", stats);
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await adminService.getAllUsers();
    successResponse(res, "Users retrieved", users);
  } catch (error) {
    next(error);
  }
};

const toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await adminService.toggleUserStatus(req.user.id, id);
    successResponse(res, `User status updated successfully`, user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats,
  getUsers,
  toggleUserStatus,
};
