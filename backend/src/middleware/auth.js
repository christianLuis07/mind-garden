const jwt = require("jsonwebtoken");
const { prisma } = require("../config/database");
const { errorResponse } = require("../utils/response");

const auth = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return errorResponse(res, "Unauthorized", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true, avatar: true, role: true, isActive: true },
    });

    if (!user) {
      return errorResponse(res, "Unauthorized", 401);
    }

    if (user.isActive === false) {
      return errorResponse(res, "Akun Anda telah dinonaktifkan. Silakan hubungi admin.", 403);
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return errorResponse(res, "Unauthorized", 401);
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, name: true, role: true },
      });
      if (user && user.isActive) {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    next();
  }
};

module.exports = {
  auth,
  optionalAuth,
};
