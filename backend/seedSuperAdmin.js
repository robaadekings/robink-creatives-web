require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

async function seedSuperAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existing = await User.findOne({ role: "admin" });

    if (existing) {
      console.log("Admin already exists");
      process.exit();
    }

    const admin = await User.create({
      name: "Super Admin",
      email: "admin@yourcompany.com",
      password: "StrongPassword123!",
      role: "admin"
    });

    console.log("Super Admin created:", admin.email);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedSuperAdmin();