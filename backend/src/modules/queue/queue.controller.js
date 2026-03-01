const { asyncHandler } = require("../../utils/asyncHandler");
const { txQueue } = require("./queue");

const stats = asyncHandler(async (req, res) => {
  const counts = await txQueue.getJobCounts("waiting", "active", "completed", "failed", "delayed");
  res.json({ ok: true, data: { queue: txQueue.name, counts } });
});

module.exports = { stats };