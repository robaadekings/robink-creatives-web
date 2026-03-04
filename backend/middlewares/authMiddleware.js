const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const User = require("../models/User");

const authenticateToken = async function (req, res, next) {
  try {
    let token;

    const header = req.headers.authorization;

    if (header && header.startsWith("Bearer ")) {
      token = header.split(" ")[1];
    }

    if (!token) {
      return next(new ApiError(401, "Unauthorized — token missing"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return next(new ApiError(401, "User no longer exists"));
    }

    if (!user.isActive) {
      return next(new ApiError(403, "Account deactivated"));
    }

    req.user = user;

    next();
  } catch (err) {
    return next(new ApiError(401, "Invalid or expired token"));
  }
};

const roleCheck = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Unauthorized — user not authenticated"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, "Forbidden — insufficient permissions"));
    }

    next();
  };
};

module.exports = { authenticateToken, roleCheck };