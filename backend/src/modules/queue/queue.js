const { Queue } = require("bullmq");
const IORedis = require("ioredis");
const { env } = require("../../config/env");

const connection = new IORedis({
  host: env.REDIS_HOST || "localhost",
  port: env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null,
});

const txQueue = new Queue(env.BULLMQ_QUEUE, { connection });

module.exports = { txQueue, connection };