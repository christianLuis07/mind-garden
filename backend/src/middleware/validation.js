const { body, validationResult } = require("express-validator");
const { errorResponse } = require("../utils/response");
const { prisma } = require("../config/database");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(
      res,
      "Validation Failed",
      400,
      errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      }))
    );
  }
  next();
};

// Auth Validation
const validateRegister = [
  body("email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("Masukkan Email yang Valid")
    .custom(async (email) => {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new Error("Email Sudah Terdaftar");
      }
    }),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password setidaknya terdiri dari 8 karakter"),
  body("name")
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Nama harus terdiri dari 3 hingga 50 karakter"),
  handleValidationErrors,
];

// Login Validation
const validateLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Masukkan Email yang Valid"),
  body("password").notEmpty().withMessage("Password tidak boleh kosong"),
  handleValidationErrors,
];

// mood Validation
const validateMoodEntry = [
  body("mood")
    .isInt({ min: 1, max: 5 })
    .withMessage("Mood harus berupa angka antara 1 hingga 5"),
  body("notes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Catatan maksimal 500 karakter"),
  body("factors")
    .optional()
    .isObject()
    .withMessage("Factors harus berupa objek"),
  handleValidationErrors,
];

// Journal Validation
const validateJournalEntry = [
  body("title")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Judul maksimal 200 karakter"),
  body("content")
    .trim()
    .isLength({ min: 1, max: 10000 })
    .withMessage("Konten harus terdiri dari 1 hingga 10.000 karakter"),
  body("tags.*").isString().withMessage("Setiap tag harus berupa teks"),
  body("isPublic")
    .optional()
    .isBoolean()
    .withMessage("isPublic harus berupa boolean"),
  handleValidationErrors,
];

// Support group validation
const validateSupportGroup = [
  body("name")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Group name must be between 3 and 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
  body("isPublic")
    .optional()
    .isBoolean()
    .withMessage("isPublic must be a boolean"),
  body("maxMembers")
    .optional()
    .isInt({ min: 2, max: 500 })
    .withMessage("Max members must be between 2 and 500"),
  handleValidationErrors,
];

const validateGroupMessage = [
  body("content")
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage("Message must be between 1 and 1000 characters"),
  body("messageType")
    .optional()
    .isIn(["text", "image", "system"])
    .withMessage("Message type must be text, image, or system"),
  handleValidationErrors,
];

const validateEmail = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("silakan masukkan email yang valid"),
  handleValidationErrors,
];

const validatePasswordReset = [
  body("token").notEmpty().withMessage("Reset token dibutuhkan"),
  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("Password baru setidaknya terdiri dari 8 karakter"),
  handleValidationErrors,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateMoodEntry,
  validateJournalEntry,
  validateSupportGroup,
  validateGroupMessage,
  validateEmail,
  validatePasswordReset,
  handleValidationErrors,
};
