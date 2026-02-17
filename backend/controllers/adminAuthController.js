const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Admin = require("../models/Admin");
const ApiError = require("../utils/ApiError");


// ==============================
// helper — generate jwt
// ==============================
function generateToken(admin) {
  return jwt.sign(
    {
      id: admin._id,
      role: admin.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}



// ==============================
// Admin Register
// ==============================
exports.registerAdmin = async (req, res, next) => {
  try {

    const exists = await Admin.findOne({ email: req.body.email });
    if (exists) throw new ApiError(400, "Admin already exists");

    const admin = await Admin.create(req.body);

    res.status(201).json({
      success: true,
      data: admin
    });

  } catch (err) {
    next(err);
  }
};



// ==============================
// Admin Login
// ==============================
exports.loginAdmin = async (req, res, next) => {
  try {

    const { email, password } = req.body;

    const admin = await Admin
      .findOne({ email })
      .select("+password");

    if (!admin) throw new ApiError(401, "Invalid credentials");

    const match = await admin.comparePassword(password);
    if (!match) throw new ApiError(401, "Invalid credentials");

    admin.lastLogin = new Date();
    await admin.save();

    const token = generateToken(admin);

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (err) {
    next(err);
  }
};



// ==============================
// Forgot Password (DEV MODE — returns token)
// ==============================
exports.forgotPassword = async (req, res, next) => {
  try {

    const admin = await Admin.findOne({ email: req.body.email });
    if (!admin) throw new ApiError(404, "Admin not found");

    const resetToken = crypto.randomBytes(32).toString("hex");

    admin.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    admin.resetPasswordExpires = Date.now() + 1000 * 60 * 30; // 30 min

    await admin.save();

    // ✅ No email — return token directly
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

    const admin = await Admin.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpires: { $gt: Date.now() }
    }).select("+password");

    if (!admin) throw new ApiError(400, "Invalid or expired token");

    admin.password = req.body.password;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;

    await admin.save();

    res.json({
      success: true,
      message: "Password reset successful"
    });

  } catch (err) {
    next(err);
  }
};



// ==============================
// Get Current Admin
// ==============================
exports.getMe = async (req, res, next) => {
  try {

    const admin = await Admin.findById(req.user.id);

    res.json({
      success: true,
      data: admin
    });

  } catch (err) {
    next(err);
  }
};
