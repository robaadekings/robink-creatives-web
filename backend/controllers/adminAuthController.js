const jwt = require("jsonwebtoken");
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
// Admin Register (optional — first admin)
// disable later in production
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

    if (!admin) {
      throw new ApiError(401, "Invalid credentials");
    }

    const match = await admin.comparePassword(password);

    if (!match) {
      throw new ApiError(401, "Invalid credentials");
    }

    // update last login
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
