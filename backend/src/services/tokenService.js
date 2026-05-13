const crypto = require("crypto");

class TokenService {
  generateVerificationToken() {
    return crypto.randomBytes(32).toString("hex");
  }

  generateResetToken() {
    return crypto.randomBytes(32).toString("hex");
  }

  getResetTokenExpiry() {
    return new Date(Date.now() + 60 * 60 * 1000); // 1 jam
  }

  getVerificationExpiry() {
    return new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 jam
  }


  isTokenExpired(expiryDate) {
    return new Date() > new Date(expiryDate);
  }
}

module.exports = new TokenService();
