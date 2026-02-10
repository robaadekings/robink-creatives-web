const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");


// =====================================
// Cloudinary Storage Configuration
// =====================================

const storage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => {
    // Decide folder dynamically based on route
    let folder = "general";

    if (req.baseUrl.includes("services")) folder = "services";
    if (req.baseUrl.includes("portfolio")) folder = "portfolio";

    return {
      folder,
      resource_type: "image",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],

      // optional: better file naming
      public_id: `${Date.now()}-${file.originalname
        .split(".")[0]
        .replace(/\s+/g, "-")
        .toLowerCase()}`
    };
  }
});


// =====================================
// Multer Upload Middleware
// =====================================

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB per file
  },

  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  }
});


module.exports = upload;
