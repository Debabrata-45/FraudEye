const router = require("express").Router();
const { auth } = require("../../middlewares/auth");
const { rbac } = require("../../middlewares/rbac");
const { validate } = require("../../middlewares/validate");
const { createTxSchema } = require("./transactions.validators");
const ctrl = require("./transactions.controller");

router.post("/", auth, rbac("admin", "analyst"), validate(createTxSchema), ctrl.createTransaction);
router.get("/", auth, rbac("admin", "analyst"), ctrl.listTransactions);
router.get("/:id", auth, rbac("admin", "analyst"), ctrl.getTransactionById);

module.exports = router;