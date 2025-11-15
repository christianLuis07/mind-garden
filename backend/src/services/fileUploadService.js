const { format } = require("winston");
const { cloudinary } = require("../config/cloudinary");
const logger = require("../utils/logger");

class FileUploadService {
  // Upload avatar dan return URL
  async uploadAvatar(file, userId) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "mindgarden/avatars",
        public_id: `avatar_${userId}_${Date.now()}`,
        transformation: [
          { width: 200, height: 200, crop: "fill", gravity: "face" },
          { quality: "auto" },
          { format: "png" },
        ],
      });

      logger.info("upload Avatar Berhasil", {
        userId,
        imageId: result.public_id,
      });

      return result.secure_url;
    } catch (error) {
      logger.error("Upload Avatar Gagal", { userId, error: error.message });
      throw new Error("Gagal Mengupload avatar");
    }
  }

  //   upload gambar Jurnal
  async uploadJournalImages(files, userId) {
    try {
      const uploadPromises = files.map((file) =>
        cloudinary.uploader.upload(file.path, {
          folder: "mindgarden/journal-images",
          public_id: `journal_${userId}_${Date.now()}_${Math.random()
            .toString(36)
            .substring(7)}`,
          transformation: [
            { width: 1200, crop: "limit", quality: "auto" },
            { format: "auto" },
          ],
        })
      );
      const results = await Promise.all(uploadPromises);
      const imageUrls = results.map((result) => result.secure_url);

      logger.info("gambar journal berhasil diupload", {
        userId,
        imageCount: imageUrls.length,
      });

      return imageUrls;
    } catch (error) {
      logger.error("gambar Journal gagal diupload", {
        userId,
        error: error.message,
      });
      throw new Error("Gagal Mengupload Gambar Journal");
    }
  }

  // Upload support group image
  async uploadSupportImage(file, userId, groupId) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "mindgarden/support-groups",
        public_id: `support_${groupId}_${userId}_${Date.now()}`,
        transformation: [
          { width: 800, crop: "limit", quality: "auto" },
          { format: "auto" },
        ],
      });

      logger.info("Support group gambar berhasil diupload", {
        userId,
        groupId,
        imageId: result.public_id,
      });

      return result.secure_url;
    } catch (error) {
      logger.error("support group gambar gagal diupload", {
        userId,
        groupId,
        error: error.message,
      });
      throw new Error("Ggagal mengupload Gambar Support");
    }
  }

  // Delete image from Cloudinary
  async deleteImage(publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);

      if (result.result === "ok") {
        logger.info("gambar berhasil dihapus", { publicId });
        return true;
      } else {
        logger.warn("gambar gagal dihapus", {
          publicId,
          result: result.result,
        });
        return false;
      }
    } catch (error) {
      logger.error("Gambar gagal dihapus", { publicId, error: error.message });
      throw new Error("Gagal menghapus gambar");
    }
  }

  // Extract public ID from Cloudinary URL
  extractPublicId(url) {
    const matches = url.match(/\/upload\/(?:v\d+\/)?([^\.]+)/);
    return matches ? matches[1] : null;
  }

  // Get image info
  async getImageInfo(publicId) {
    try {
      const result = await cloudinary.api.resource(publicId);
      return result;
    } catch (error) {
      logger.error("info gambar gagal diambil", {
        publicId,
        error: error.message,
      });
      return null;
    }
  }
}

module.exports = new FileUploadService();
