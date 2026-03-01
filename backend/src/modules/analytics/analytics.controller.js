const { asyncHandler } = require("../../utils/asyncHandler");
const { summary } = require("./analytics.service");

const getSummary = asyncHandler(async (req, res) => {
  const data = await summary();
  res.json({ ok: true, data });
});

module.exports = { getSummary };