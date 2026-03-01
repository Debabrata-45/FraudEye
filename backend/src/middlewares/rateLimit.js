const rateLimit = require("express-rate-limit");

const rateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120, // basic protection
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { rateLimiter };