const multer = require("multer");
const path = require("path");
const {
  avatarStorage,
  journalImageStorage,
  supportGroupStorage,
} = require("../config/cloudinary");

// File filter
const fileFilter = (req, file, cb) => {
  // check tipe file
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Tipe file tidak didukung"), false);
  }
};

// buat upload instance
const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // default 5MB
    files: 1, // maksimal 1 file
  },
});

const uploadJournalImage = multer({
  storage: journalImageStorage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // default 5MB
    files: 5, // maksimal 5 file
  },
});

const uploadSupportImage = multer({
  storage: supportGroupStorage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // default 5MB
    files: 1, // maksimal 1 file
  },
});

// Error handling middleware
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "Ukuran file terlalu besar. Maksimal ukuran file adalah 5MB.",
      });
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        message: "Jumlah file melebihi batas yang diizinkan.",
      });
    }
  }
  if (error.message.includes("Tipe file tidak didukung")) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  next(error);
};

module.exports = {
  uploadAvatar,
  uploadJournalImage,
  uploadSupportImage,
  handleUploadError,
};
