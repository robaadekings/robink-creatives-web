const ApiError = require("../utils/ApiError");

module.exports = function roleMiddleware(...allowedRoles) {
  return (req, res, next) => {

    // -------------------------
    // Check authentication first
    // -------------------------
    if (!req.admin) {
      return next(new ApiError(401, "Not authenticated"));
    }

    // -------------------------
    // Check role permission
    // -------------------------
    if (!allowedRoles.includes(req.admin.role)) {
      return next(
        new ApiError(403, "Forbidden — insufficient permissions")
      );
    }

    next();
  };
};


