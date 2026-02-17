const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Client = require("../models/Client");
const ApiError = require("../utils/ApiError");

function sign(client) {
  return jwt.sign(
    { id: client._id, role: "client" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}



// =======================
// Client Register
// =======================
exports.registerClient = async (req,res,next)=>{
  try {

    const exists = await Client.findOne({ email: req.body.email });
    if (exists) throw new ApiError(400,"Client exists");

    const client = await Client.create(req.body);

    res.json({ success:true, data: client });

  } catch(e){ next(e); }
};



// =======================
// Client Login
// =======================
exports.loginClient = async (req,res,next)=>{
  try {

    const client = await Client
      .findOne({ email: req.body.email })
      .select("+password");

    if (!client) throw new ApiError(401,"Invalid credentials");

    const ok = await client.comparePassword(req.body.password);
    if (!ok) throw new ApiError(401,"Invalid credentials");

    res.json({
      success:true,
      token: sign(client)
    });

  } catch(e){ next(e); }
};



// =======================
// Forgot Password
// =======================
exports.clientForgotPassword = async (req,res,next)=>{
  try {

    const client = await Client.findOne({ email: req.body.email });
    if (!client) throw new ApiError(404,"Client not found");

    const token = crypto.randomBytes(32).toString("hex");

    client.resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    client.resetPasswordExpires = Date.now() + 30*60*1000;

    await client.save();

    // DEV MODE — return token
    res.json({
      success:true,
      resetToken: token
    });

  } catch(e){ next(e); }
};



// =======================
// Reset Password
// =======================
exports.clientResetPassword = async (req,res,next)=>{
  try {

    const hashed = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const client = await Client.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpires: { $gt: Date.now() }
    }).select("+password");

    if (!client) throw new ApiError(400,"Invalid token");

    client.password = req.body.password;
    client.resetPasswordToken = undefined;
    client.resetPasswordExpires = undefined;

    await client.save();

    res.json({ success:true });

  } catch(e){ next(e); }
};
