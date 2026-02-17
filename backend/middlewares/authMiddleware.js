const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const Admin = require("../models/Admin"); // make sure this file exists

module.exports = async function authMiddleware(req, res, next) {
  try {
    let token;

    // ----------------------------
    // Read Bearer token from header
    // ----------------------------
    const header = req.headers.authorization;

    if (header && header.startsWith("Bearer ")) {
      token = header.split(" ")[1];
    }

    if (!token) {
      return next(new ApiError(401, "Unauthorized — token missing"));
    }

    // ----------------------------
    // Verify token
    // ----------------------------
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ----------------------------
    // Load admin from DB
    // ----------------------------
    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) {
      return next(new ApiError(401, "Admin no longer exists"));
    }

    // ----------------------------
    // Attach to request
    // ----------------------------
    req.admin = admin;

    next();

  } catch (err) {
    return next(new ApiError(401, "Invalid or expired token"));
  }
};
