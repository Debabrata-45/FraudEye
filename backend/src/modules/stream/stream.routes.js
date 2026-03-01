const router = require("express").Router();
const { streamTransactions } = require("./stream.controller");

router.get("/transactions", ...streamTransactions);

module.exports = router;