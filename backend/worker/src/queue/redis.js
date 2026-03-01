const IORedis = require("ioredis");
const { env } = require("../config/env");

const redis = new IORedis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  maxRetriesPerRequest: null, // REQUIRED for BullMQ
});

module.exports = { redis };