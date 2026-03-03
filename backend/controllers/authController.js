const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");

// ==============================
// Helper — Generate JWT
// ==============================
function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// ==============================
// Register (Public = Client Only)
// ==============================
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new ApiError(400, "Name, email and password are required");
    }

    const exists = await User.findOne({ email });
    if (exists) {
      throw new ApiError(400, "User already exists");
    }

    // 🔥 Always force role to client (security protection)
    const user = await User.create({
      name,
      email,
      password,
      role: "client"
    });

    res.status(201).json({
      success: true,
      message: "Client registered successfully"
    });

  } catch (err) {
    next(err);
  }
};

// ==============================
// Login (Admin + Client)
// ==============================
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) throw new ApiError(401, "Invalid credentials");

    const match = await user.comparePassword(password);
    if (!match) throw new ApiError(401, "Invalid credentials");

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    next(err);
  }
};

// ==============================
// Forgot Password
// ==============================
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new ApiError(404, "User not found");

    const resetToken = user.createPasswordResetToken();
    await user.save();

    res.json({
      success: true,
      message: "Reset token generated (DEV MODE)",
      resetToken
    });

  } catch (err) {
    next(err);
  }
};

// ==============================
// Reset Password
// ==============================
exports.resetPassword = async (req, res, next) => {
  try {
    const hashed = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashed,
      passwordResetExpires: { $gt: Date.now() }
    }).select("+password");

    if (!user) throw new ApiError(400, "Invalid or expired token");

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    res.json({
      success: true,
      message: "Password reset successful"
    });

  } catch (err) {
    next(err);
  }
};

// ==============================
// Get Current User
// ==============================
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      success: true,
      data: user
    });

  } catch (err) {
    next(err);
  }
};