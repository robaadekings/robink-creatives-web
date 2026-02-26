const User = require("../models/User");
const ApiError = require("../utils/ApiError");

exports.promoteToAdmin = async (req, res, next) => {
  try {

    const user = await User.findById(req.params.id);

    if (!user) throw new ApiError(404, "User not found");

    user.role = "admin";
    await user.save();

    res.json({
      success: true,
      message: "User promoted to admin"
    });

  } catch (err) {
    next(err);
  }  
};