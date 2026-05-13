const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Simpan konfigurasi untuk tipe upload yang berbeda
const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "mindgarden/avatars",
    format: async (req, file) => "png",
    transformation: [
      { width: 200, height: 200, crop: "fill", gravity: "face" },
      { quality: "auto" },
      { format: "png" },
    ],
    public_id: (req, file) => {
      const timestamp = Date.now();
      return `avatar_${req.user.id}_${timestamp}`;
    },
  },
});

const journalImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "mindgarden/journal-images",
    transformation: [
      { width: 1200, crop: "limit", quality: "auto" },
    ],
    public_id: (req, file) => {
      const timestamp = Date.now();
      return `journal_${req.user.id}_${timestamp}`;
    },
  },
});

const supportGroupStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "mindgarden/support-groups",
    transformation: [
      { width: 1200, crop: "limit", quality: "auto" },
    ],
    public_id: (req, file) => {
      const timestamp = Date.now();
      return `supportgroup_${req.user.id}_${timestamp}`;
    },
  },
});

const supportMessageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "mindgarden/support-messages",
    transformation: [
      { width: 1200, crop: "limit", quality: "auto" },
    ],
    public_id: (req, file) => {
      const timestamp = Date.now();
      return `supportmsg_${req.user.id}_${timestamp}`;
    },
  },
});

module.exports = {
  cloudinary,
  avatarStorage,
  journalImageStorage,
  supportGroupStorage,
  supportMessageStorage,
};
