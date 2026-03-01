const { asyncHandler } = require("../../utils/asyncHandler");
const { streamHub } = require("./stream.hub");
const { auth } = require("../../middlewares/auth");

const streamTransactions = [
  auth,
  asyncHandler(async (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    const send = (payload) => {
      res.write(`event: message\n`);
      res.write(`data: ${JSON.stringify(payload)}\n\n`);
    };

    // initial hello
    send({ type: "hello", at: new Date().toISOString() });

    const unsubscribe = streamHub.subscribe((evt) => send(evt));

    // keep-alive ping
    const interval = setInterval(() => send({ type: "ping", at: new Date().toISOString() }), 15000);

    req.on("close", () => {
      clearInterval(interval);
      unsubscribe();
      res.end();
    });
  }),
];

module.exports = { streamTransactions };