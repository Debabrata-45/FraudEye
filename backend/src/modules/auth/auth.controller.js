const { asyncHandler } = require("../../utils/asyncHandler");
const { loginService } = require("./auth.service");

const login = asyncHandler(async (req, res) => {
  const result = await loginService(req.body);
  res.json({ ok: true, data: result });
});

module.exports = { login };