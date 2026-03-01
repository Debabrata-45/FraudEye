import { Queue } from "bullmq";
import { redis } from "./redis.js";
import { env } from "../config/env.js";

export const scanQueue = new Queue(env.BULLMQ_QUEUE, {
  connection: redis,
  defaultJobOptions: {
    attempts: 5,
    backoff: { type: "exponential", delay: 2000 },
    removeOnComplete: 200,
    removeOnFail: 200,
  },
});