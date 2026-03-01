const jwt = require("jsonwebtoken");
const { env } = require("../config/env");
const { ApiError } = require("../utils/ApiError");

function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return next(new ApiError(401, "Missing token", "ERR_AUTH"));

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    req.user = payload; // { userId, role, email }
    return next();
  } catch {
    return next(new ApiError(401, "Invalid token", "ERR_AUTH"));
  }
}

module.exports = { auth };