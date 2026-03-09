const { EventEmitter } = require("events");
const IORedis = require("ioredis");

const emitter = new EventEmitter();
emitter.setMaxListeners(100);

// Subscribe to Redis pub/sub for worker predictions
const subscriber = new IORedis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379", 10),
  maxRetriesPerRequest: null,
});

subscriber.subscribe("fraudeye:predictions", (err) => {
  if (err) console.error("Redis subscribe error:", err);
  else console.log("✅ Stream hub subscribed to fraudeye:predictions");
});

subscriber.on("message", (channel, message) => {
  try {
    const event = JSON.parse(message);
    emitter.emit("event", event);
  } catch (e) {
    console.error("Stream hub parse error:", e);
  }
});

function broadcast(event) {
  emitter.emit("event", event);
}

function subscribe(onEvent) {
  emitter.on("event", onEvent);
  return () => emitter.off("event", onEvent);
}

const streamHub = { broadcast, subscribe };
module.exports = { streamHub };