const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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

    lastLogin: Date
  },
  { timestamps: true }
);



// ✅ Password Hash Before Save

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});



// ✅ Password Compare Method

adminSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};


module.exports = mongoose.model("Admin", adminSchema);

