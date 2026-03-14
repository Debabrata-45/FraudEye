const { asyncHandler } = require("../../utils/asyncHandler");
const { streamHub } = require("./stream.hub");
const { auth } = require("../../middlewares/auth");

const streamTransactions = [
  auth,
  asyncHandler(async (req, res) => {
    const origin = req.headers.origin || "*";
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.flushHeaders?.();

    const send = (payload) => {
      res.write(`event: message\n`);
      res.write(`data: ${JSON.stringify(payload)}\n\n`);
    };

    send({ type: "hello", at: new Date().toISOString() });

    const unsubscribe = streamHub.subscribe((evt) => send(evt));

    const interval = setInterval(() => send({ type: "ping", at: new Date().toISOString() }), 15000);

    req.on("close", () => {
      clearInterval(interval);
      unsubscribe();
      res.end();
    });
  }),
];

module.exports = { streamTransactions };