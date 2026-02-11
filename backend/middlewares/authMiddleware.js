const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");

module.exports = function auth(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      throw new ApiError(401, "Unauthorized");
    }

    const token = header.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();

  } catch (err) {
    next(new ApiError(401, "Invalid or expired token"));
  }
};
;