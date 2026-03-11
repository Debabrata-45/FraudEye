const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const { env } = require("../../config/env");
const { query } = require("../../db");
const { ApiError } = require("../../utils/ApiError");

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

async function loginService(body) {
  let parsed;
  try {
    parsed = loginSchema.parse(body);
  } catch (e) {
    throw new ApiError(400, "Invalid request: " + e.errors[0].message, "ERR_VALIDATION");
  }

  const { email, password } = parsed;
  const r = await query("SELECT id, email, password_hash, role FROM users WHERE email=$1", [email]);
  const user = r.rows[0];
  if (!user) throw new ApiError(401, "Invalid credentials", "ERR_LOGIN");
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) throw new ApiError(401, "Invalid credentials", "ERR_LOGIN");

  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );
  return { token, user: { id: user.id, email: user.email, role: user.role } };
}

module.exports = { loginService };