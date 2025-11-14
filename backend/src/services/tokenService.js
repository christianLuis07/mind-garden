const crypto = require("crypto");

class TokenService {
  generateVerificationToken() {
    return crypto.randomBytes(32).toString("hex");
  }

  generateResetToken() {
    return crypto.randomBytes(32).toString("hex");
  }

  // Token expiration times
  getVerificationExpiry() {
    return new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  }

  getResetTokenExpiry() {
    return new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  }

  isTokenExpired(expiryDate) {
    return new Date() > new Date(expiryDate);
  }
}

module.exports = new TokenService();
