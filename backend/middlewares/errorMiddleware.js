module.exports = (err, req, res, next) => {
  console.error("FULL ERROR:", err);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      message: messages.join(", ")
    });
  }

  // Duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "Duplicate field value entered"
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error"
  });
};