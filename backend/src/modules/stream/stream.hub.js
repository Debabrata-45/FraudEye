const { EventEmitter } = require("events");
const emitter = new EventEmitter();

function broadcast(event) {
  emitter.emit("event", event);
}

function subscribe(onEvent) {
  emitter.on("event", onEvent);
  return () => emitter.off("event", onEvent);
}

const streamHub = { broadcast, subscribe };
module.exports = { streamHub };