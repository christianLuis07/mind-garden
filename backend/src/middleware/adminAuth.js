const { errorResponse } = require("../utils/response");

const authorizeAdmin = (req, res, next) => {
  if (!req.user) {
    return errorResponse(res, "Unauthorized", 401);
  }

  if (req.user.role !== "admin") {
    return errorResponse(
      res,
      "Anda tidak memiliki akses ke resource ini",
      403
    );
  }

  next();
};

module.exports = { authorizeAdmin };
