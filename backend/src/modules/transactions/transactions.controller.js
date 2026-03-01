const { asyncHandler } = require("../../utils/asyncHandler");
const service = require("./transactions.service");

const createTransaction = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const out = await service.createTransaction(userId, req.validated, req.body);
  res.status(201).json({ ok: true, data: out });
});

const listTransactions = asyncHandler(async (req, res) => {
  const out = await service.listTransactions(req.query);
  res.json({ ok: true, data: out });
});

const getTransactionById = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ ok: false, error: "Invalid transaction ID" });
  }
  const out = await service.getTransactionById(id);
  res.json({ ok: true, data: out });
});

module.exports = { createTransaction, listTransactions, getTransactionById };