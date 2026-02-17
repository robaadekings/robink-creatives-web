const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false // 🔒 never return password by default
    },

    role: {
      type: String,
      enum: ["admin", "manager"],
      default: "admin"
    },

    isActive: {
      type: Boolean,
      default: true
    },

    lastLogin: Date,

    // ✅ Password reset support
    passwordResetToken: String,
    passwordResetExpires: Date
  },
  { timestamps: true }
);


/* =========================
   Hash Password Before Save
========================= */

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});


/* =========================
   Compare Password Method
========================= */

adminSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};


/* =========================
   Create Reset Token Method
========================= */

adminSchema.methods.createPasswordResetToken = function () {

  const resetToken = crypto.randomBytes(32).toString("hex");

  // store hashed token in DB
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // expires in 30 minutes
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000;

  return resetToken; // send raw token via email
};


module.exports = mongoose.model("Admin", adminSchema);
